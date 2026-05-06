import { Request, Response } from 'express';
import Booking from '../models/booking.model.ts';
import Notification from '../models/notification.model.ts';

// Lazy Stripe init — only when actually called, not at module load
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set in .env');
  const Stripe = require('stripe');
  return new Stripe(key);
}

// @desc    Handle Stripe webhook events
// @route   POST /api/webhook
// @access  Public (Stripe)
export const handleStripeWebhook = async (req: Request, res: Response) => {
  let event: any;

  try {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // Dev mode without webhook secret
      event = JSON.parse(req.body.toString());
    }
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.client_reference_id;

    if (bookingId) {
      try {
        const booking = await Booking.findById(bookingId).populate('packageItem', 'title');
        if (booking) {
          booking.isPaid = true;
          booking.paidAt = new Date();
          booking.status = 'confirmed';
          booking.paymentResult = {
            id: session.payment_intent,
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: session.customer_email || '',
          };
          await booking.save();

          const pkgTitle = (booking.packageItem as any)?.title || 'your package';
          await Notification.create({
            user: booking.user,
            type: 'booking',
            title: 'Payment Confirmed ✅',
            message: `Stripe payment of $${booking.totalPrice.toFixed(2)} received for "${pkgTitle}". Your booking is confirmed!`,
            link: '/user/bookings',
          });

          console.log(`✅ Booking ${bookingId} confirmed via Stripe webhook`);
        }
      } catch (err) {
        console.error('Error updating booking:', err);
      }
    }
  }

  res.json({ received: true });
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/bookings/:id/checkout
// @access  Private
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const stripe = getStripe();
    const booking = await Booking.findById(req.params.id).populate('packageItem');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== (req as any).user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (booking.isPaid) {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    const pkg = booking.packageItem as any;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      client_reference_id: booking._id.toString(),
      customer_email: (req as any).user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pkg?.title || 'Travel Package',
              description: `${booking.guests} guest(s) · ${new Date(booking.startDate).toLocaleDateString()} → ${new Date(booking.endDate).toLocaleDateString()}`,
              images: pkg?.images?.[0] ? [pkg.images[0]] : [],
            },
            unit_amount: Math.round(booking.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/booking/success?bookingId=${booking._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/booking/cancel?bookingId=${booking._id}`,
      metadata: { bookingId: booking._id.toString() },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe checkout error:', err.message);
    res.status(500).json({ message: err.message || 'Stripe checkout failed' });
  }
};
