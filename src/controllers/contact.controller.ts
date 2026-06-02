import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Contact from '../models/contact.model';

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, topic, message } = req.body;

  if (!name || !email || !topic || !message) {
    res.status(400);
    throw new Error('Please fill in all fields (name, email, topic, message)');
  }

  const contact = await Contact.create({
    name,
    email,
    topic,
    message,
  });

  res.status(201).json({
    success: true,
    message: 'Message received! We will get back to you shortly.',
    data: contact,
  });
});

// @desc    Get all contact messages (admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json(contacts);
});
