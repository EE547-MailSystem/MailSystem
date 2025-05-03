export const mockEmails = [
  {
    from: "hr@company.com",
    body: "Please review the attached employee handbook updates. These changes will be effective starting next month.\n\nBest regards,\nHR Department",
    subject: "Updated Employee Handbook",
    to: "you@company.com",
    category: "Work",
    tags: new Set(["Policy", "Important"]),
    summary: "New employee handbook updates for review",
    urgent_status: false,
    read_status: true
  },
  {
    from: "notifications@linkedin.com",
    body: "You have 3 new connection requests:\n1. John Doe (Recruiter at Tech Corp)\n2. Jane Smith (Software Engineer)\n3. Mike Johnson (Product Manager)",
    subject: "New connection requests on LinkedIn",
    to: "you@personal.com",
    category: "Social",
    tags: new Set(["Networking", "Professional"]),
    summary: "You have 3 new LinkedIn connection requests",
    urgent_status: false,
    read_status: false
  },
  {
    from: "support@bank.com",
    body: "Your statement for account ending in 1234 is now available. Log in to your online banking to view the full statement.\n\nThank you for banking with us.",
    subject: "Your Monthly Statement",
    to: "you@personal.com",
    category: "Finance",
    tags: new Set(["Statement", "Account"]),
    summary: "Monthly bank statement available",
    urgent_status: false,
    read_status: false
  },
  {
    from: "deals@shopping.com",
    body: "FLASH SALE: 50% OFF all electronics for the next 24 hours! Use code ELECTRO50 at checkout. Limited quantities available!",
    subject: "24-Hour Electronics Sale!",
    to: "you@personal.com",
    category: "Promotions",
    tags: new Set(["Sale", "Limited Time"]),
    summary: "Flash sale on electronics - 50% off",
    urgent_status: false,
    read_status: true
  },
  {
    from: "ceo@company.com",
    body: "EMERGENCY: All hands meeting today at 3PM in the main conference room. Attendance is mandatory. We will discuss critical company updates.",
    subject: "URGENT: All Hands Meeting Today",
    to: "all@company.com",
    category: "Work",
    tags: new Set(["Urgent", "Meeting"]),
    summary: "Emergency all-hands meeting today at 3PM",
    urgent_status: true,
    read_status: false
  },
  {
    from: "no-reply@facebook.com",
    body: "You have 5 new notifications:\n- Sarah liked your post\n- Mike commented on your photo\n- 3 new friend requests",
    subject: "New Facebook Notifications",
    to: "you@personal.com",
    category: "Social",
    tags: new Set(["Notifications", "Social"]),
    summary: "New activity on your Facebook account",
    urgent_status: false,
    read_status: true
  },
  {
    from: "security@bank.com",
    body: "ALERT: Unusual login attempt detected from a new device in California. If this wasn't you, please secure your account immediately.",
    subject: "Security Alert: Unusual Login Attempt",
    to: "you@personal.com",
    category: "Finance",
    tags: new Set(["Security", "Alert"]),
    summary: "Unusual login attempt detected",
    urgent_status: true,
    read_status: false
  },
  {
    from: "newsletter@tech.news",
    body: "This week in tech:\n1. Apple announces new MacBook Pro\n2. Google releases Android 14\n3. Microsoft acquires AI startup",
    subject: "Weekly Tech Digest",
    to: "you@personal.com",
    category: "Newsletters",
    tags: new Set(["Tech", "Roundup"]),
    summary: "Weekly roundup of tech news",
    urgent_status: false,
    read_status: false
  },
  {
    from: "winner@lottery.com",
    body: "CONGRATULATIONS! You've won $1,000,000! Click here to claim your prize: http://scam.example.com",
    subject: "You're Our Lucky Winner!",
    to: "you@personal.com",
    category: "Spam",
    tags: new Set(["Scam", "Suspicious"]),
    summary: "Suspicious lottery winning notification",
    urgent_status: false,
    read_status: true
  },
  {
    from: "team@project.org",
    body: "Reminder: Project deadline is tomorrow. Please submit your deliverables by 5PM. Late submissions will not be accepted.",
    subject: "Project Deadline Reminder",
    to: "team@project.org",
    category: "Work",
    tags: new Set(["Deadline", "Reminder"]),
    summary: "Friendly reminder about tomorrow's project deadline",
    urgent_status: true,
    read_status: false
  }
];

export const categories = [
  'all',
  'Work',
  'Social',
  'Finance',
  'Promotions',
  'Newsletters',
  'Spam'
];

export const importancePrompt = "Mark as urgent if: contains time-sensitive action items, comes from executives, or relates to security alerts";