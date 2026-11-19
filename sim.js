/* BaitGuard simulator — Gmail-, WhatsApp- and iMessage-style "safe or bait?" scenarios.
   All names, numbers, domains and brands in the scenarios are fictional. */
(() => {
  'use strict';

  /* ------------------------------------------------------------------ data */
  // Flags: [title, explanation]. A <mark data-f="n"> in the content points at flag n.

  const MAIL = [
    {
      id: 'm1', verdict: 'bait', unread: true, time: '09:41', avatar: '#123b6d',
      name: 'Northgate Bank', email: 'security@northgate-bank-alerts.com', emailFlag: 1,
      subject: 'Action required: unusual sign-in detected',
      snippet: 'We detected an unusual sign-in attempt to your Online Banking from a new device…',
      body: `<div class="em-card"><div class="em-bar" style="background:#123b6d"><span class="em-logo">NORTHGATE</span><span class="em-logo-sub">BANK</span></div>
        <p><mark data-f="2">Dear Valued Customer,</mark></p>
        <p>We detected an unusual sign-in attempt to your Online Banking from a new device in <b>Lagos, Nigeria</b>.</p>
        <p>For your protection, your account has been temporarily limited. <mark data-f="3">You must verify your identity within 24 hours or your account will be permanently suspended.</mark></p>
        <p class="em-center"><mark data-f="4"><a class="lnk em-btn" style="background:#123b6d" data-url="http://northgate-secure-login.co/verify?id=88213">Verify my account</a></mark></p>
        <p>Thank you for banking with us,<br>Northgate Bank Security Team</p>
        <p class="em-fine">© 2026 Northgate Bank plc. This is an automated message. Please do not reply.</p></div>`,
      flags: [
        ['Lookalike sender address', 'It comes from northgate-bank-alerts.com, not the bank’s real domain. Anyone can register a name like that.'],
        ['Generic greeting', 'Your bank knows your name. “Dear Valued Customer” means the same email went to thousands of people.'],
        ['Urgency and a threat', 'A 24-hour deadline and “permanently suspended” are there to make you act before you think.'],
        ['The button hides another website', 'Hover over it: it leads to northgate-secure-login.co, a page built to steal your login.']
      ],
      lesson: 'If you’re worried, close the email and open your banking app, or type the bank’s address yourself. Never sign in from an email link.'
    },
    {
      id: 'm7', verdict: 'bait', unread: true, time: '09:02', avatar: '#e8443a',
      name: 'Streamly', email: 'billing@streamly-accounts.help', emailFlag: 1,
      subject: 'Your membership is on hold',
      snippet: 'We couldn’t process your most recent payment. Update your payment details…',
      context: 'You pay £8.99 a month for Streamly. Check the rest of the inbox too.',
      body: `<div class="em-card"><div class="em-bar" style="background:#141414"><span class="em-logo" style="color:#ff5a4f">streamly</span></div>
        <h2 class="em-h">Your membership is on hold</h2>
        <p>Hi,</p>
        <p>We couldn’t process your most recent payment. <mark data-f="2">Update your payment details within 48 hours</mark> to keep enjoying your favourite shows without interruption.</p>
        <p class="em-center"><mark data-f="3"><a class="lnk em-btn" style="background:#e8443a" data-url="https://streamly-accounts.help/billing/update">Update payment method</a></mark></p>
        <p>The Streamly Team</p></div>`,
      flags: [
        ['Lookalike domain', 'streamly-accounts.help is not streamly.com. Compare it with Monday’s genuine receipt.'],
        ['A deadline to rush you', '“Within 48 hours” pushes you to fix it now instead of checking.'],
        ['The link asks for your card', 'The page behind this button exists to collect your card details.'],
        ['It contradicts what you know', 'Monday’s receipt from the real streamly.com says your payment went through.']
      ],
      lesson: 'Check billing problems by opening the app or website yourself. If there really is a payment problem, it will show there.'
    },
    {
      id: 'm2', verdict: 'safe', unread: true, time: '08:15', avatar: '#ff7a1a',
      name: 'Shopwell', email: 'orders@shopwell.co.uk', emailFlag: 1,
      subject: 'Your order #SW-48213 has shipped',
      snippet: 'Good news, your order is on its way. Estimated delivery Thursday…',
      context: 'You ordered wireless earbuds from Shopwell on Monday.',
      body: `<div class="em-card"><div class="em-bar" style="background:#ff7a1a"><span class="em-logo">shopwell</span></div>
        <p><mark data-f="2">Hi Alex,</mark></p>
        <p>Good news, your order is on its way.</p>
        <div class="em-order"><div><span>Order</span><b>#SW-48213</b></div><div><span>Item</span><b>Wireless earbuds, black</b></div><div><span>Estimated delivery</span><b>Thursday 26 November</b></div></div>
        <p><mark data-f="3">There’s nothing you need to do.</mark> You can follow your parcel any time from <b>Your orders</b> in the Shopwell app.</p>
        <p>Thanks for shopping with us,<br>Shopwell</p></div>`,
      flags: [
        ['Sender matches the shop', 'orders@shopwell.co.uk uses the same domain as the shop’s website.'],
        ['Uses your name', 'It’s addressed to you, not to “Dear Customer”.'],
        ['Asks for nothing', 'No login, payment or deadline. It sends you to the app instead of a link.'],
        ['Matches something you did', 'You ordered earbuds on Monday and the order details line up.']
      ],
      lesson: 'Genuine messages usually tell you something rather than push you to act. Even so, tracking through the app is always the safest route.'
    },
    {
      id: 'm3', verdict: 'bait', unread: true, time: 'Yesterday', avatar: '#5f6368',
      name: 'HR Department', email: 'hr-notifications@peoplehub-docs.net', emailFlag: 1,
      subject: '2026 salary adjustment – please review',
      snippet: 'Please find attached your updated salary and bonus letter for 2026…',
      attachment: { name: 'Salary_Review_2026.html', size: '14 KB', flag: 2 },
      context: 'You work at Corvel Ltd. Work emails end in @corvel.com.',
      body: `<p>Hello,</p>
        <p>Please find attached your updated salary and bonus letter for 2026, following this year’s performance review.</p>
        <p><mark data-f="3">To open the document you will be asked to sign in with your work email and password.</mark></p>
        <p><mark data-f="4">This document expires at 17:00 today.</mark></p>
        <p>Regards,<br>HR Department</p>`,
      flags: [
        ['Not from your company', 'Corvel’s HR would write from @corvel.com, not peoplehub-docs.net.'],
        ['An .html “document”', 'Salary letters are PDFs or sit in the HR system. An .html attachment opens a fake login page in your browser.'],
        ['Asks for your password', 'Nothing you’re sent should need your work password typed into it.'],
        ['Artificial deadline', '“Expires at 17:00 today” stops you from asking HR first.'],
        ['No named sender', 'Real HR emails come from a person or a system you recognise, not just “HR Department”.']
      ],
      lesson: 'Salary, bonus and “document shared with you” emails are among the most common workplace phishing lures. Report it to IT, don’t just delete it.'
    },
    {
      id: 'm4', verdict: 'safe', unread: false, time: 'Yesterday', avatar: '#0b8043',
      name: 'Marta Ruiz', email: 'marta.ruiz@corvel.com', emailFlag: 1,
      subject: 'Notes from the project meeting',
      snippet: 'Thanks for joining the project meeting earlier. Quick recap of the actions…',
      context: 'Marta is a colleague at Corvel. You were in a meeting with her yesterday morning.',
      body: `<p><mark data-f="2">Hi Alex,</mark></p>
        <p>Thanks for joining the project meeting earlier. Quick recap of the actions:</p>
        <ul><li>You: finish the supplier comparison by Friday</li><li>Me: book a room for next week’s review</li><li>Sam: send round the updated budget</li></ul>
        <p><mark data-f="3">I’ve added the notes to our team folder as usual.</mark> Shout if I missed anything!</p>
        <p>Marta</p>`,
      flags: [
        ['Internal address', 'marta.ruiz@corvel.com is your company’s own domain.'],
        ['Personal and specific', 'It refers to the real meeting and names the actual tasks.'],
        ['No new links or attachments', 'It points to the shared folder you already use.'],
        ['Nothing unusual is asked', 'No money, passwords, secrecy or rush.']
      ],
      lesson: 'Context is your best tool. This email fits exactly what you’d expect from Marta.'
    },
    {
      id: 'm5', verdict: 'bait', unread: false, time: 'Tue', avatar: '#8430ce',
      name: 'Daniel Ortiz', email: 'daniel.ortiz.ceo@mailbox-pro.com', emailFlag: 1,
      subject: 'Quick favour',
      snippet: 'Are you at your desk? I’m in back-to-back meetings all afternoon…',
      context: 'Daniel Ortiz is the CEO of Corvel, the company you work for.',
      body: `<p>Alex,</p>
        <p>Are you at your desk? I’m in back-to-back meetings all afternoon and <mark data-f="2">can’t take calls</mark>, but I need you to handle something for me.</p>
        <p><mark data-f="3">I need five £100 gift cards</mark> as a thank-you for a client. <mark data-f="4">Buy them and reply with the codes</mark>, and I’ll make sure you’re reimbursed tonight.</p>
        <p><mark data-f="5">Please keep this between us for now</mark>, it’s a surprise.</p>
        <p>Daniel<br><span class="em-fine">Sent from my phone</span></p>`,
      flags: [
        ['Personal address, not the company’s', 'A CEO would write from @corvel.com. Anyone can create “daniel.ortiz.ceo” on a free mail service.'],
        ['Can’t be reached', '“Can’t take calls” stops you from checking with him.'],
        ['Gift cards', 'They work like cash and can’t be traced or refunded. No real business pays clients this way.'],
        ['Send the codes', 'Once you share the codes, the money is gone.'],
        ['Secrecy', 'Being asked to keep quiet stops you from asking a colleague.']
      ],
      lesson: 'Check unusual requests from senior people another way, such as a call or chat to a number you already have. A real boss won’t mind.'
    },
    {
      id: 'm6', verdict: 'safe', unread: false, time: 'Mon', avatar: '#e8443a',
      name: 'Streamly', email: 'no-reply@streamly.com', emailFlag: 1,
      subject: 'Thanks for your payment',
      snippet: 'Your Standard plan payment of £8.99 was successful…',
      context: 'You pay £8.99 a month for Streamly.',
      body: `<div class="em-card"><div class="em-bar" style="background:#141414"><span class="em-logo" style="color:#ff5a4f">streamly</span></div>
        <h2 class="em-h">Thanks for your payment</h2>
        <p><mark data-f="2">Hi Alex,</mark></p>
        <div class="em-order"><div><span>Plan</span><b>Standard</b></div><div><span>Amount</span><b><mark data-f="3">£8.99</mark></b></div><div><span>Paid with</span><b>Visa ending 4417</b></div><div><span>Next payment</span><b>16 December 2026</b></div></div>
        <p><mark data-f="4">No action is needed.</mark> To change your plan, go to <b>Account</b> in the Streamly app.</p></div>`,
      flags: [
        ['Real domain', 'no-reply@streamly.com is the service’s own address.'],
        ['Uses your name', 'It’s addressed to you personally.'],
        ['The amount matches', '£8.99 is exactly what you pay each month.'],
        ['No action needed', 'There’s no link to click and nothing to “update”.']
      ],
      lesson: 'Compare with what you know. This receipt fits, and that’s also what gives away the fake “payment failed” email that came later.'
    }
  ];

  const CHAT = [
    {
      id: 'c1', verdict: 'bait', name: '+44 7700 900877', contact: false, time: '10:12', unread: 5,
      preview: 'here are the details 👇',
      context: 'You have a daughter, Emily. Her number is saved in your contacts.',
      msgs: [
        { day: 'TODAY' },
        { t: 'Hi Mum, it’s me 😊 dropped my phone in the toilet 🙈 <mark data-f="1">this is my new number</mark>, you can delete the old one', time: '10:04' },
        { t: 'are you there? <mark data-f="2">I need a favour, it’s a bit urgent</mark>', time: '10:07' },
        { t: 'I have to pay a bill today but my banking app won’t work on the new phone 😩 can you pay £640 for me? I’ll pay you back tomorrow xx', time: '10:09' },
        { t: '<mark data-f="3">can’t talk right now, the mic on this phone is broken</mark>', time: '10:10' },
        { t: 'here are the details 👇\nName: <mark data-f="4">K. Marsh</mark>\nSort code: 30-94-21\nAccount: 41827733', time: '10:12' }
      ],
      flags: [
        ['A “new number” story', 'Scammers write from unknown numbers and explain it away with a lost or broken phone.'],
        ['Pressure to act now', '“A bit urgent” is meant to stop you from checking.'],
        ['Avoids a call', 'An excuse not to talk means you can’t hear that it isn’t your child.'],
        ['The account isn’t theirs', 'Emily asking you to pay a stranger, “K. Marsh”, is a major red flag.']
      ],
      lesson: 'Call your child on the number you already have, or ask something only they would know. In the UK you can forward scam texts to 7726.'
    },
    {
      id: 'c2', verdict: 'safe', name: 'Sara 🌻', contact: true, color: '#d97706', time: '09:30', unread: 1,
      preview: 'Booked 8pm at Lola’s 🍝 see you there',
      context: 'Sara is a close friend.',
      msgs: [
        { day: 'YESTERDAY' },
        { me: true, t: 'We need to catch up! <mark data-f="1">Dinner this week?</mark>', time: '21:14' },
        { t: 'Yes!! Friday works for me', time: '21:20' },
        { me: true, t: 'Perfect 🙌', time: '21:21' },
        { day: 'TODAY' },
        { t: 'Booked 8pm at Lola’s 🍝 <mark data-f="2">see you there</mark>', time: '09:30' }
      ],
      flags: [
        ['A saved contact and a normal history', 'Sara is in your contacts and this continues a conversation you started.'],
        ['Nothing is asked of you', 'No money, codes or links, just plans.'],
        ['It fits what you agreed', 'Friday dinner is exactly what you arranged.']
      ],
      lesson: 'Not every message is a threat. Genuine messages fit an existing conversation and ask for nothing unusual.'
    },
    {
      id: 'c3', verdict: 'bait', name: 'Tom (5-a-side)', contact: true, color: '#2563eb', time: '08:47', unread: 2,
      preview: 'can you send it over? it’s 6 digits',
      context: 'A text with a 6-digit WhatsApp code just arrived on your phone. You didn’t ask for one.',
      msgs: [
        { day: 'SUNDAY' },
        { t: 'Great game today ⚽ same time next week?', time: '18:02' },
        { me: true, t: 'Defo, count me in', time: '18:30' },
        { day: 'TODAY' },
        { t: 'Hey mate, sorry, <mark data-f="1">I sent my WhatsApp code to your number by mistake</mark> 🤦‍♂️', time: '08:46' },
        { t: '<mark data-f="2">can you send it over? it’s 6 digits</mark>', time: '08:47' }
      ],
      flags: [
        ['A code you didn’t ask for', 'Codes go to the phone being registered. If you got one, someone is trying to put YOUR WhatsApp on their phone.'],
        ['They want your code', 'Sharing it hands over your account. The scammer then messages all your contacts, just like this one.'],
        ['Known contacts can be hacked', 'Tom’s account has probably been taken over. The name you trust is the bait.']
      ],
      lesson: 'Never share verification codes with anyone. Turn on two-step verification in WhatsApp, and call Tom to tell him he’s been hacked.'
    },
    {
      id: 'c5', verdict: 'safe', name: 'Flat 4B 🏠', group: 'Jamie, Priya, You', contact: true, color: '#0d9488', time: '08:05', unread: 3,
      preview: 'Priya: done! 🙏',
      context: 'You share a flat with Jamie and Priya. Bills are usually split three ways.',
      msgs: [
        { day: 'TODAY' },
        { from: 'Jamie', fc: '#c2185b', t: 'Morning! Electricity bill came in, £126 total, so <mark data-f="1">£42 each</mark>. <mark data-f="2">I’ve already paid it, send me yours whenever</mark> 👍', time: '07:58' },
        { from: 'Jamie', fc: '#c2185b', t: '<mark data-f="3">Bill is in the shared folder if you want to check</mark>', time: '07:59' },
        { from: 'Priya', fc: '#1565c0', t: 'done! 🙏', time: '08:05' }
      ],
      flags: [
        ['Matches your usual split', '£126 ÷ 3 = £42, the same as always.'],
        ['No pressure, paid to someone you know', '“Whenever” is the opposite of scam urgency, and the money goes to your flatmate.'],
        ['You can check it', 'The bill is somewhere you already have access to.']
      ],
      lesson: 'Money requests aren’t automatically scams. What matters is who is asking, whether it fits, and whether you can check it.'
    },
    {
      id: 'c4', verdict: 'bait', name: '+62 812 4400 3195', contact: false, time: 'Yesterday', unread: 3,
      preview: 'To start, just add our receptionist on Telegram 😊',
      msgs: [
        { day: 'YESTERDAY' },
        { t: 'Hello! I’m Emma from TalentLink Recruitment 👋 <mark data-f="1">We found your CV online</mark>', time: '16:20' },
        { t: 'We offer a flexible remote job: like and rate videos for 30 mins a day and <mark data-f="2">earn £150–£400 daily</mark>. Interested?', time: '16:21' },
        { t: '<mark data-f="3">To start, just add our receptionist on Telegram</mark> 😊 <a class="lnk" data-url="https://t.me/talentlink_hr_desk">t.me/talentlink_hr_desk</a>', time: '16:23' }
      ],
      flags: [
        ['Unsolicited, from abroad', 'A recruiter you’ve never heard of, writing from an international number.'],
        ['Too good to be true', 'Hundreds a day for liking videos isn’t a real job.'],
        ['Moves you to another app', 'Switching to Telegram gets you away from WhatsApp’s spam protection. Later you’ll be asked to “deposit” money to unlock your earnings.']
      ],
      lesson: 'Real recruiters don’t pay you to like videos. Block and report: tap the number, then Report.'
    }
  ];

  const SMS = [
    {
      id: 's1', verdict: 'bait', name: '+44 7700 900412', contact: false, label: 'Text Message • SMS', when: 'Today 10:24', time: '10:24', unread: true,
      preview: 'ParcelPoint: Your parcel could not be delivered due to an unpaid shipping fee…',
      msgs: [
        { t: 'ParcelPoint: <mark data-f="2">Your parcel</mark> could not be delivered due to an <mark data-f="3">unpaid shipping fee of £1.45</mark>. Pay now to arrange redelivery: <mark data-f="4"><a class="lnk" data-url="https://parcelpoint-redelivery.info/gb">parcelpoint-redelivery.info/gb</a></mark>' }
      ],
      flags: [
        ['A random mobile number', 'Delivery companies send texts from a short code or their name, not a personal +44 7 number.'],
        ['No details about you', 'No name, tracking number or shop, so it can be sent to anyone.'],
        ['A tiny fee', 'The £1.45 isn’t the point. They want your card details.'],
        ['A lookalike link', 'parcelpoint-redelivery.info isn’t the courier’s website.']
      ],
      lesson: 'Couriers don’t text you surprise fees. Check with your tracking number in the courier’s own app. In the UK, forward scam texts to 7726.'
    },
    {
      id: 's2', verdict: 'safe', name: 'Northgate', contact: true, label: 'Text Message • SMS', when: 'Today 10:02', time: '10:02', unread: true,
      preview: 'Northgate: 482913 is your code to sign in to Online Banking…',
      context: 'You just tapped “Sign in” in your Northgate banking app.',
      msgs: [
        { stamp: 'Mon 18:31' },
        { t: 'Northgate: 771204 is your code to sign in to Online Banking. Never share this code — we will never call or text to ask for it.' },
        { stamp: 'Today 10:02' },
        { t: 'Northgate: <mark data-f="2">482913 is your code to sign in to Online Banking.</mark> <mark data-f="3">Never share this code — we will never call or text to ask for it.</mark>' }
      ],
      flags: [
        ['You asked for it', 'You just tried to sign in, so a code is expected.'],
        ['Exactly what you expect', 'A code for the action you just took, in the same format as before.'],
        ['No link, and a clear warning', 'It asks for nothing and reminds you not to share it.'],
        ['Same thread as earlier codes', 'It sits with previous genuine codes. Sender names can sometimes be faked, though, so what you were doing matters most.']
      ],
      lesson: 'A code you requested is fine to type into the app you’re using. The danger is anyone asking you to read it out to them.'
    },
    {
      id: 's4', verdict: 'bait', name: 'toll-notice@roadpay-uk.com', contact: false, email: true, label: 'iMessage', when: 'Today 09:15', time: '09:15', unread: true,
      preview: 'FINAL NOTICE: You have an unpaid road toll of £6.80…',
      msgs: [
        { t: '<mark data-f="2">FINAL NOTICE</mark>: You have an unpaid road toll of £6.80. <mark data-f="3">Pay by midnight to avoid a £50 penalty</mark>: <a class="lnk" data-url="https://roadpay-uk.com/pay">roadpay-uk.com/pay</a>\n\n<mark data-f="4">Please reply Y, then exit and reopen this message to activate the link.</mark>' }
      ],
      flags: [
        ['Sent from an email address', 'iMessage lets anyone message you from an email address. Official bodies don’t send fines this way.'],
        ['“Final notice” out of nowhere', 'You’ve never had a first notice.'],
        ['Small fine, big threat', 'A cheap amount plus a penalty makes paying feel like the easy option.'],
        ['The “reply Y” trick', 'Your phone switches off links from unknown senders. Replying turns the link back on and confirms your number is active.']
      ],
      lesson: 'Only check fines or tolls on the official website, typing the address in yourself. Tap “Report Junk” and delete.'
    },
    {
      id: 's6', verdict: 'bait', name: '+44 7700 900731', contact: false, label: 'iMessage', when: 'Yesterday 19:12', time: 'Yesterday', unread: false,
      preview: 'Oh sorry! Wrong number 😅 That’s so embarrassing…',
      msgs: [
        { t: '<mark data-f="1">Hi Jessica, it’s Lily from the yoga retreat</mark> 🧘‍♀️ are we still on for lunch on Saturday?' },
        { me: true, t: 'Sorry, I think you have the wrong number' },
        { t: 'Oh sorry! Wrong number 😅 That’s so embarrassing. <mark data-f="2">You seem really kind though, where are you based?</mark>' }
      ],
      flags: [
        ['A “wrong number” opener', 'A friendly message to a stranger is a cheap way to find people who reply.'],
        ['Keeps the chat going', 'Instead of apologising and leaving, they move on to personal questions. These chats build trust over weeks, then turn to crypto “investment” tips.']
      ],
      lesson: 'You don’t need to reply to wrong-number texts. If you already have, don’t keep chatting. Block and report.'
    },
    {
      id: 's3', verdict: 'bait', name: '+44 7700 900255', contact: false, label: 'Text Message • SMS', when: 'Yesterday 21:48', time: 'Yesterday', unread: false,
      preview: 'NORTHGATE: Did you attempt a payment of £749.99 to TECHSTORE ONLINE?…',
      context: 'You bank with Northgate. Their genuine texts arrive in the “Northgate” conversation.',
      msgs: [
        { t: '<mark data-f="1">NORTHGATE</mark>: Did you attempt a payment of <mark data-f="2">£749.99 to TECHSTORE ONLINE</mark>? If NOT, reply NO and <mark data-f="3">our fraud team will call you</mark> to secure your account.' }
      ],
      flags: [
        ['Not your bank’s usual thread', 'This comes from an ordinary mobile number, not the Northgate conversation.'],
        ['Designed to panic you', 'A large payment you didn’t make is meant to stop you thinking clearly.'],
        ['They want to phone you', 'Replying confirms your number. The “fraud team” call will ask you to move money to a “safe account”, which no bank ever does.']
      ],
      lesson: 'Worried about a payment? Check your banking app or call the number on the back of your card. Don’t reply.'
    },
    {
      id: 's5', verdict: 'safe', name: 'Smile Dental', contact: true, label: 'Text Message • SMS', when: 'Mon 12:00', time: 'Mon', unread: false,
      preview: 'Thanks, see you on Tuesday!',
      context: 'You booked a dental check-up at Smile Dental last month.',
      msgs: [
        { t: 'Smile Dental: <mark data-f="1">Reminder of your check-up with Dr Patel on Tue 24 Nov at 10:30.</mark> <mark data-f="2">Reply C to confirm</mark> or <mark data-f="3">call us on 020 7946 0321</mark> to rearrange.' },
        { me: true, t: 'C' },
        { t: 'Thanks, see you on Tuesday!' }
      ],
      flags: [
        ['Matches your booking', 'You booked this check-up yourself.'],
        ['No link or payment', 'Replying “C” is all it asks.'],
        ['A number you can check', 'You can compare it with the practice’s website or your appointment card.']
      ],
      lesson: 'Reminders that fit a real booking, ask for nothing sensitive and contain no links are normal.'
    }
  ];

  const DATA = { mail: MAIL, chat: CHAT, sms: SMS };
  const APPS = {
    mail: { label: 'Gmail', noun: 'email', nouns: 'emails' },
    chat: { label: 'WhatsApp', noun: 'chat', nouns: 'chats' },
    sms:  { label: 'iMessage', noun: 'message', nouns: 'messages' }
  };

  /* ---------------------------------------------------------------- icons */
  const ICONS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    more: '<circle cx="12" cy="5.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="18.5" r="1.4" fill="currentColor" stroke="none"/>',
    star: '<path d="M12 3.8l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z"/>',
    attach: '<path d="M16.5 7l-7.8 7.8a2.2 2.2 0 0 0 3.1 3.1l7.9-7.9a4.2 4.2 0 0 0-6-6l-7.9 7.9a6.2 6.2 0 0 0 8.8 8.8l6.4-6.4"/>',
    inbox: '<path d="M4 13h4.5l1.5 2.5h4l1.5-2.5H20"/><path d="M4 13l2.2-7h11.6L20 13v6H4z"/>',
    send: '<path d="M4 12l16-8-5.5 16-3-6.5z"/>',
    pen: '<path d="M4 20h4L19.5 8.5l-4-4L4 16z"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
    file: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/>',
    alert: '<path d="M12 3.5l8.5 15h-17z"/><path d="M12 9.5v4M12 16.3v.2"/>',
    trash: '<path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/>',
    archive: '<path d="M4 5h16v4H4zM5.5 9v10h13V9M10 13h4"/>',
    refresh: '<path d="M19 12a7 7 0 1 1-2.1-5"/><path d="M19 4.5V9h-4.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3.5"/>',
    emoji: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14c1.8 2 5.2 2 7 0"/><circle cx="9.3" cy="10" r=".9" fill="currentColor" stroke="none"/><circle cx="14.7" cy="10" r=".9" fill="currentColor" stroke="none"/>',
    video: '<rect x="3.5" y="6.5" width="12" height="11" rx="2"/><path d="M15.5 10.5l5-3v9l-5-3"/>',
    phone: '<path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C10.6 18.4 5.6 13.4 5 5.6A1.5 1.5 0 0 1 6.5 4Z"/>',
    ticks: '<path d="M2.5 12.5l3.5 3.5 7.5-8M10.5 15l1 1 7.5-8"/>',
    chev: '<path d="M9.5 6l6 6-6 6"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.2"/>',
    lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    person: '<circle cx="12" cy="9" r="4" fill="currentColor" stroke="none"/><path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5z" fill="currentColor" stroke="none"/>',
    group: '<circle cx="9" cy="9" r="3.3" fill="currentColor" stroke="none"/><circle cx="16.5" cy="10" r="2.6" fill="currentColor" stroke="none"/><path d="M2.5 19.5c.8-3.6 3.6-5.2 6.5-5.2s5.7 1.6 6.5 5.2zM14.5 14.4c2.8-.6 6 .6 7 5.1h-5" fill="currentColor" stroke="none"/>',
    shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    hook: '<path d="M15 3.5V14a4.5 4.5 0 0 1-9 0v-3l-2.5 2.5"/><circle cx="15" cy="3.5" r="1.2"/>',
    camera: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.3"/>',
    signal: '<path d="M4 18v-2M8.5 18v-5M13 18V10M17.5 18V6.5" stroke-width="2.6"/>',
    battery: '<rect x="3" y="7.5" width="16" height="9" rx="2.5"/><rect x="5" y="9.5" width="11" height="5" rx="1" fill="currentColor" stroke="none"/><path d="M21 10.5v3"/>'
  };
  const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const initials = (s) => s.replace(/[^\p{L}\s]/gu, '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const nl = (s) => s.replace(/\n/g, '<br>');
  const bgMark = '<svg class="bgm" aria-hidden="true"><use href="#bg-mark"/></svg>';

  /* ---------------------------------------------------------------- state */
  const STORE = 'baitguard-sim-v1';
  let saved = { answers: {}, read: {} };
  try {
    const s = JSON.parse(localStorage.getItem(STORE));
    if (s && typeof s === 'object') saved = { answers: s.answers || {}, read: s.read || {} };
  } catch (e) { /* storage unavailable: progress lives in memory only */ }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(saved)); } catch (e) {} };

  const answered = (id) => saved.answers[id];
  const isRight = (it) => saved.answers[it.id] === it.verdict;
  const isUnread = (it) => it.unread && !saved.read[it.id];

  function parse() {
    const [a, id] = location.hash.replace(/^#/, '').split('/');
    const app = APPS[a] ? a : 'mail';
    const item = id ? DATA[app].find(x => x.id === id) || null : null;
    return { app, item };
  }

  /* -------------------------------------------------------------- shared UI */
  function badge(it) {
    const a = answered(it.id);
    if (!a) return '';
    return isRight(it)
      ? `<span class="rb ok" title="You answered correctly">✓ ${it.verdict === 'bait' ? 'Bait spotted' : 'Safe'}</span>`
      : `<span class="rb bad" title="Review this one">✗ Missed</span>`;
  }

  function banner(app) {
    const items = DATA[app], meta = APPS[app];
    const done = items.filter(i => answered(i.id));
    const note = '<small>Training simulation. Not affiliated with Google, Meta or Apple. All names, numbers and links are fictional.</small>';
    if (done.length < items.length) {
      return `<div class="bg-banner">${bgMark}<div><b>Spot the bait</b><span>Open each ${meta.noun} and decide: safe or bait? <strong>${done.length} of ${items.length}</strong> reviewed.</span>${note}</div></div>`;
    }
    const right = items.filter(isRight).length;
    const msg = right === items.length ? 'Perfect. You caught every scam and trusted every genuine message.'
      : right >= items.length - 1 ? 'Nearly perfect. Open the one marked ✗ to see what you missed.'
      : 'Open the ones marked ✗ to see the signs you missed.';
    const others = Object.keys(APPS).filter(k => k !== app && DATA[k].some(i => !answered(i.id)));
    return `<div class="bg-banner done">${bgMark}<div><b>${right} / ${items.length} correct</b><span>${msg}</span>
      <div class="bg-banner-acts">${others.map(k => `<a href="#${k}">Try ${APPS[k].label} →</a>`).join('')}<button type="button" data-reset-app="${app}">Try again</button>${others.length ? '' : '<a href="index.html">Back to BaitGuard</a>'}</div></div></div>`;
  }

  function nextHash(app, cur) {
    const items = DATA[app];
    const start = items.findIndex(i => i.id === cur);
    for (let k = 1; k <= items.length; k++) {
      const it = items[(start + k) % items.length];
      if (!answered(it.id)) return `#${app}/${it.id}`;
    }
    return `#${app}`;
  }

  function coach(it, app) {
    const meta = APPS[app];
    const a = answered(it.id);
    if (!a) {
      return `<section class="coach" aria-label="Your decision">
        <div class="coach-tag">${bgMark}Your call</div>
        <p class="coach-title">Is this ${meta.noun} safe or bait?</p>
        ${it.context ? `<p class="coach-ctx"><b>What you know:</b> ${it.context}</p>` : ''}
        <div class="coach-btns">
          <button type="button" data-ans="safe">${ic('shield')}Safe</button>
          <button type="button" data-ans="bait">${ic('hook')}Bait</button>
        </div>
      </section>`;
    }
    const right = isRight(it), bait = it.verdict === 'bait';
    const more = DATA[app].some(i => !answered(i.id));
    const sub = right
      ? (bait ? 'You spotted the scam.' : 'Good call. Not everything is a scam.')
      : (bait ? 'This one was a scam. Here’s what gave it away.' : 'This one was genuine. Here’s why you can trust it.');
    return `<section class="coach is-done ${right ? 'is-right' : 'is-wrong'} ${bait ? 'v-bait' : 'v-safe'}" aria-live="polite">
      <div class="coach-res"><span class="coach-ico" aria-hidden="true">${right ? '✓' : '✗'}</span>
        <div>${right ? 'Correct' : 'Not quite'}: this ${meta.noun} is <em>${bait ? 'bait' : 'safe'}</em>.<small>${sub}</small></div></div>
      <p class="coach-sub">${bait ? 'Warning signs' : 'Why it’s safe'} <span>· numbers match the highlights</span></p>
      <ol class="coach-flags">${it.flags.map((f, i) => `<li><span class="n">${i + 1}</span><div><b>${f[0]}</b><span>${f[1]}</span></div></li>`).join('')}</ol>
      <p class="coach-lesson"><b>Take-away:</b> ${it.lesson}</p>
      <div class="coach-next"><button type="button" data-next>${more ? `Next ${meta.noun} →` : 'See your score →'}</button></div>
    </section>`;
  }

  const revealCls = (it) => answered(it.id) ? `revealed ${it.verdict}` : '';

  /* ----------------------------------------------------------------- Gmail */
  function renderMail(open) {
    const items = DATA.mail;
    const unread = items.filter(isUnread).length;
    const side = `<aside class="gm-side">
      <div class="gm-compose">${ic('pen')}Compose</div>
      <div class="gm-nav">
        <div class="on">${ic('inbox')}<span>Inbox</span><b>${unread || ''}</b></div>
        <div>${ic('star')}<span>Starred</span></div>
        <div>${ic('clock')}<span>Snoozed</span></div>
        <div>${ic('send')}<span>Sent</span></div>
        <div>${ic('file')}<span>Drafts</span></div>
        <div>${ic('alert')}<span>Spam</span></div>
      </div></aside>`;

    let main;
    if (!open) {
      main = `<div class="gm-tools"><span class="gm-cb"></span>${ic('refresh')}${ic('more')}<span class="gm-count">1–${items.length} of ${items.length}</span></div>
        <div class="gm-tabs"><div class="on">${ic('inbox')}Primary</div></div>
        ${banner('mail')}
        <ul class="gm-list">${items.map(it => `<li><a class="gm-row ${isUnread(it) ? 'unread' : ''}" href="#mail/${it.id}">
          <span class="gm-cb"></span><span class="gm-star">${ic('star')}</span>
          <span class="gm-from">${it.name}</span>
          <span class="gm-text"><span class="gm-subj">${it.subject}</span><span class="gm-snip"><span class="gm-dash"> – </span>${it.snippet}</span></span>
          ${it.attachment ? `<span class="gm-att">${ic('attach')}</span>` : ''}
          ${badge(it)}
          <span class="gm-time">${it.time}</span></a></li>`).join('')}</ul>`;
    } else {
      const idx = items.indexOf(open);
      const addr = open.emailFlag ? `<mark data-f="${open.emailFlag}">${open.email}</mark>` : open.email;
      const att = open.attachment ? `<div class="gm-attach">
          <div class="gm-attach-card">${ic('file')}<div>${open.attachment.flag ? `<mark data-f="${open.attachment.flag}">${open.attachment.name}</mark>` : open.attachment.name}<small>${open.attachment.size}</small></div></div></div>` : '';
      main = `<div class="gm-tools"><a class="gm-ib" href="#mail" aria-label="Back to inbox">${ic('back')}</a>${ic('archive')}${ic('alert')}${ic('trash')}<span class="gm-count">${idx + 1} of ${items.length}</span></div>
        <article class="gm-read ${revealCls(open)}">
          <h1 class="gm-h">${open.subject} <span class="gm-chip">Inbox</span></h1>
          <div class="gm-sender">
            <span class="gm-avatar" style="background:${open.avatar}">${initials(open.name)}</span>
            <div class="gm-who"><div><b>${open.name}</b> <span class="gm-addr">&lt;${addr}&gt;</span></div><div class="gm-to">to me ▾</div></div>
            <div class="gm-when">${open.time}</div>
          </div>
          <div class="gm-content">${open.body}${att}</div>
          <div class="gm-replies"><span>${ic('back')}Reply</span><span>Forward ${ic('chev')}</span></div>
          ${coach(open, 'mail')}
        </article>`;
    }

    return `<div class="gm ${open ? 'is-open' : ''}">
      <header class="gm-top">
        <span class="gm-ib">${ic('menu')}</span>
        <div class="gm-logo"><svg aria-hidden="true"><use href="#app-mail"/></svg><span>Gmail</span></div>
        <div class="gm-search">${ic('search')}<span>Search mail</span></div>
        <span class="gm-av">A</span>
      </header>
      <div class="gm-body">${side}<section class="gm-main">${main}</section></div>
    </div>`;
  }

  /* -------------------------------------------------------------- WhatsApp */
  function waAvatar(it, cls = '') {
    if (it.group) return `<span class="wa-av ${cls}" style="background:${it.color}">${ic('group')}</span>`;
    if (!it.contact) return `<span class="wa-av unknown ${cls}">${ic('person')}</span>`;
    return `<span class="wa-av ${cls}" style="background:${it.color}">${initials(it.name)}</span>`;
  }

  function renderChat(open) {
    const items = DATA.chat;
    const list = items.map(it => {
      const unr = isUnread(it);
      return `<li><a class="wa-row ${open === it ? 'on' : ''}" href="#chat/${it.id}">
        ${waAvatar(it)}
        <div class="wa-row-txt">
          <div class="wa-top"><b>${it.name}</b><span class="${unr ? 'new' : ''}">${it.time}</span></div>
          <div class="wa-bot"><span class="wa-prev">${it.preview}</span>${badge(it)}${unr ? `<span class="wa-count">${it.unread}</span>` : ''}</div>
        </div></a></li>`;
    }).join('');

    let chat;
    if (!open) {
      chat = `<div class="wa-empty"><div><svg class="wa-empty-ic" aria-hidden="true"><use href="#app-chat"/></svg>
        <h2>Pick a chat to start</h2><p>Read each conversation and decide whether it’s safe or bait.</p>
        <p class="wa-e2e">${ic('lock')}Simulation only. Nothing you do here leaves this page.</p></div></div>`;
    } else {
      let lastKey = null;
      const msgs = open.msgs.map(m => {
        if (m.day) { lastKey = null; return `<div class="wa-day"><span>${m.day}</span></div>`; }
        const side = m.me ? 'me' : 'them';
        const key = side + (m.from || '');
        const tail = key !== lastKey;
        lastKey = key;
        return `<div class="wa-msg ${side} ${tail ? 'tail' : ''}"><div class="wa-bub">${m.from && tail ? `<b class="wa-sender" style="color:${m.fc}">${m.from}</b>` : ''}${nl(m.t)}<span class="wa-meta">${m.time}${m.me ? ic('ticks', 'tick') : ''}</span></div></div>`;
      }).join('');
      const sub = open.group ? open.group : open.contact ? 'click here for contact info' : '';
      chat = `<header class="wa-chead"><a class="wa-back" href="#chat" aria-label="Back to chats">${ic('back')}</a>${waAvatar(open, 'sm')}
          <div class="wa-chead-txt"><b>${open.name}</b>${sub ? `<small>${sub}</small>` : ''}</div>
          <span class="wa-icons">${ic('video')}${ic('phone')}${ic('search')}</span></header>
        <div class="wa-scroll ${revealCls(open)}">
          ${!open.contact ? `<div class="wa-notice">${waAvatar(open, 'lg')}<b>${open.name}</b><span>Not a contact · No groups in common</span>
            <div class="wa-notice-acts"><span class="red">Block</span><span>Report</span><span class="green">Add</span></div></div>` : ''}
          ${msgs}
          <div class="wa-coach">${coach(open, 'chat')}</div>
        </div>
        <footer class="wa-compose">${ic('plus')}<div>${ic('emoji')}<span>Type a message</span></div>${ic('mic')}</footer>`;
    }

    return `<div class="wa ${open ? 'is-open' : ''}">
      <aside class="wa-side">
        <header class="wa-head"><b>Chats</b><span class="wa-icons">${ic('plus')}${ic('more')}</span></header>
        <div class="wa-search">${ic('search')}<span>Search or start a new chat</span></div>
        <div class="wa-chips"><span class="on">All</span><span>Unread</span><span>Favourites</span><span>Groups</span></div>
        ${banner('chat')}
        <ul class="wa-list">${list}</ul>
      </aside>
      <section class="wa-chat">${chat}</section>
    </div>`;
  }

  /* -------------------------------------------------------------- iMessage */
  function imAvatar(it, cls = '') {
    return `<span class="im-av ${cls}">${it.contact ? initials(it.name) : ic('person')}</span>`;
  }

  function renderSms(open) {
    const items = DATA.sms;
    const unread = items.filter(isUnread).length;
    let screen;
    if (!open) {
      screen = `<div class="im-listhead"><span>Edit</span><span>${ic('pen')}</span></div>
        <h1 class="im-big">Messages</h1>
        <div class="im-search">${ic('search')}<span>Search</span></div>
        <div class="im-list-scroll">
          <div class="im-inline-only">${banner('sms')}</div>
          <ul class="im-list">${items.map(it => `<li><a class="im-row" href="#sms/${it.id}">
            <span class="im-dot ${isUnread(it) ? 'on' : ''}"></span>${imAvatar(it)}
            <div class="im-txt"><div class="im-top"><b>${it.name}</b><span>${it.time}${ic('chev')}</span></div>
            <p>${it.preview}</p>${badge(it)}</div></a></li>`).join('')}</ul>
        </div>`;
    } else {
      const sms = open.label.startsWith('Text');
      const msgs = open.msgs.map((m, i) => {
        if (m.stamp) return `<p class="im-stamp">${m.stamp}</p>`;
        return `<div class="im-msg ${m.me ? 'me' : 'them'}"><div class="im-bub">${nl(m.t)}</div></div>`;
      }).join('');
      const hasStamp = open.msgs.some(m => m.stamp);
      screen = `<div class="im-chead">
          <a class="im-back" href="#sms" aria-label="Back to messages">${ic('back')}${unread ? `<span>${unread}</span>` : ''}</a>
          <div class="im-who">${imAvatar(open, 'sm')}<small>${open.name} ›</small></div>
          <span class="im-video">${ic('video')}</span>
        </div>
        <div class="im-scroll ${revealCls(open)} ${sms ? 'is-sms' : ''}">
          <p class="im-label">${open.label}${hasStamp ? '' : `<br><span>${open.when}</span>`}</p>
          ${msgs}
          ${!open.contact ? `<p class="im-junk">The sender is not in your contact list.<br><a>Report Junk</a></p>` : ''}
          <div class="im-inline-only">${coach(open, 'sms')}</div>
        </div>
        <div class="im-compose"><span class="im-plus">${ic('plus')}</span><div><span>${sms ? 'Text Message' : 'iMessage'}</span>${ic('mic')}</div></div>`;
    }

    const sideInfo = open ? coach(open, 'sms') : `${banner('sms')}<div class="im-tip"><b>How it works</b><p>Tap a conversation on the phone. Read it as if it had just arrived, then decide: safe or bait. After each answer, the warning signs light up in the message.</p></div>`;

    return `<div class="im ${open ? 'is-open' : ''}">
      <div class="im-phone">
        <div class="im-status"><span>10:30</span><span class="im-island"></span><span class="im-sys">${ic('signal')}${ic('battery')}</span></div>
        <div class="im-screen">${screen}</div>
        <div class="im-home"></div>
      </div>
      <aside class="im-side">${sideInfo}</aside>
    </div>`;
  }

  /* ---------------------------------------------------------------- render */
  const root = document.getElementById('sim-root');
  const toastEl = document.querySelector('[data-toast]');
  const peek = document.querySelector('[data-urlpeek]');
  let justAnswered = false;
  let toastTimer;

  function toast(html) {
    toastEl.innerHTML = html;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 4200);
  }

  function updateBar(app) {
    document.querySelectorAll('[data-tab]').forEach(t => {
      const on = t.dataset.tab === app;
      t.classList.toggle('on', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-prog]').forEach(p => {
      const items = DATA[p.dataset.prog];
      p.textContent = `${items.filter(i => answered(i.id)).length}/${items.length}`;
    });
    const all = [...MAIL, ...CHAT, ...SMS];
    const done = all.filter(i => answered(i.id));
    document.querySelector('[data-score]').innerHTML = done.length
      ? `<b>${done.filter(isRight).length}</b> correct of ${done.length}`
      : `${all.length} scenarios`;
  }

  function render() {
    const { app, item } = parse();
    if (item && !saved.read[item.id]) { saved.read[item.id] = 1; save(); }
    updateBar(app);
    root.dataset.app = app;
    root.innerHTML = app === 'mail' ? renderMail(item) : app === 'chat' ? renderChat(item) : renderSms(item);
    root.querySelectorAll('.lnk').forEach(l => { l.setAttribute('role', 'link'); l.tabIndex = 0; });
    document.title = `${item ? (item.subject || item.name) + ' · ' : ''}${APPS[app].label} simulation · BaitGuard`;

    if (justAnswered) {
      justAnswered = false;
      const c = [...root.querySelectorAll('.coach.is-done')].find(el => el.offsetParent !== null);
      if (c) requestAnimationFrame(() => c.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
    }
  }

  root.addEventListener('click', (e) => {
    const ans = e.target.closest('[data-ans]');
    if (ans) {
      const { item } = parse();
      if (item) { saved.answers[item.id] = ans.dataset.ans; save(); justAnswered = true; render(); }
      return;
    }
    if (e.target.closest('[data-next]')) {
      const { app, item } = parse();
      const h = nextHash(app, item && item.id);
      if (h === location.hash) render(); else location.hash = h;
      return;
    }
    const resetApp = e.target.closest('[data-reset-app]');
    if (resetApp) {
      DATA[resetApp.dataset.resetApp].forEach(i => { delete saved.answers[i.id]; delete saved.read[i.id]; });
      save(); render();
      return;
    }
    const l = e.target.closest('.lnk');
    if (l) {
      e.preventDefault();
      toast(`<b>Links are switched off in the simulation.</b><span>This one leads to <code>${l.dataset.url}</code></span>`);
    }
  });

  root.addEventListener('keydown', (e) => {
    const l = e.target.closest && e.target.closest('.lnk');
    if (l && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); l.click(); }
  });

  // Browser-style URL preview in the bottom-left corner when hovering a link.
  root.addEventListener('mouseover', (e) => {
    const l = e.target.closest('.lnk');
    if (l) { peek.textContent = l.dataset.url; peek.hidden = false; }
  });
  root.addEventListener('mouseout', (e) => {
    if (e.target.closest('.lnk')) peek.hidden = true;
  });

  document.querySelector('[data-reset-all]').addEventListener('click', () => {
    saved = { answers: {}, read: {} };
    save();
    const { app } = parse();
    location.hash = `#${app}`;
    render();
    toast('<b>Progress reset.</b><span>All scenarios are fresh again.</span>');
  });

  window.addEventListener('hashchange', render);
  render();
})();
