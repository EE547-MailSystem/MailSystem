export const importancePrompt = "Mark as important if: contains urgent action items, from company executives, or related to critical projects";

export const mockEmails = [
  {
    id: '1',
    sender: 'john.doe@company.com',
    subject: 'Quarterly Financial Report',
    preview: 'Please find attached the Q2 financial report...',
    body: '<p>Dear Team,</p><p>Please find attached the Q2 financial report for your review.</p><p>Best regards,<br/>John Doe</p>',
    date: '2025-03-28T09:15:00Z',
    category: 'finance',
    read: false,
    important: true
  },
  {
    id: '2',
    sender: 'hr@company.com',
    subject: 'Important: Benefits Update',
    preview: 'We wanted to inform you about changes to...',
    body: '<p>Hello everyone,</p><p>We wanted to inform you about changes to our health benefits package starting next month.</p><p>HR Team</p>',
    date: '2025-03-27T14:30:00Z',
    category: 'work',
    read: false,
    important: true
  },
  {
    id: '3',
    sender: 'notifications@linkedin.com',
    subject: 'You have 5 new connection requests',
    preview: 'See who wants to connect with you on...',
    body: '<p>You have new connection requests waiting!</p>',
    date: '2025-03-27T11:45:00Z',
    category: 'social',
    read: true,
    important: false
  },
  {
    id: '4',
    sender: 'support@service.com',
    subject: 'Your subscription is expiring soon',
    preview: 'Your premium subscription will expire in...',
    body: '<p>Renew your subscription now to avoid service interruption.</p>',
    date: '2025-03-26T16:20:00Z',
    category: 'finance',
    read: true,
    important: false
  },
  {
    id: '5',
    sender: 'jane.smith@team.org',
    subject: 'Project Kickoff Meeting',
    preview: 'Reminder about tomorrow\'s project kickoff...',
    body: '<p>Hi team,</p><p>Just a reminder about our project kickoff meeting tomorrow at 10 AM.</p><p>Jane</p>',
    date: '2025-03-26T10:05:00Z',
    category: 'work',
    read: false,
    important: true
  },
  {
    id: '6',
    sender: 'newsletter@tech.com',
    subject: 'This Week in Tech: Latest Updates',
    preview: 'The most important tech news of the week...',
    body: '<p>Here are this week\'s top tech stories...</p>',
    date: '2025-03-25T08:00:00Z',
    category: 'newsletters',
    read: true,
    important: false
  },
  {
    id: '7',
    sender: 'no-reply@bank.com',
    subject: 'Your statement is ready',
    preview: 'Your monthly account statement is now...',
    body: '<p>Your March statement is available for download.</p>',
    date: '2025-03-24T07:30:00Z',
    category: 'finance',
    read: false,
    important: false
  },
  {
    id: '8',
    sender: 'promotions@store.com',
    subject: 'Special Offer Just For You!',
    preview: 'Get 30% off your next purchase with code...',
    body: '<p>Exclusive offer for our valued customers!</p>',
    date: '2025-03-23T12:15:00Z',
    category: 'promotions',
    read: true,
    important: false
  },
  {
    id: '9',
    sender: 'alex@friend.net',
    subject: 'Weekend plans?',
    preview: 'Hey, are you free this weekend? I was...',
    body: '<p>Hey! Are you free this weekend? I was thinking we could...</p>',
    date: '2025-03-22T18:45:00Z',
    category: 'social',
    read: false,
    important: false
  },
  {
    id: '10',
    sender: 'unknown@suspicious.com',
    subject: 'URGENT: Claim your prize now!',
    preview: 'You\'ve won $1,000,000! Click here to...',
    body: '<p>You\'re our lucky winner! Click this link to claim your prize!</p>',
    date: '2025-03-22T03:10:00Z',
    category: 'spam',
    read: false,
    important: false
  }
];

export const categories = [
  'all',
  'work',
  'finance',
  'social',
  'newsletters',
  'promotions',
  'spam'
];