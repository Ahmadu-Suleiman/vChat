import { VCon, Party } from '../types';

export const PARTIES: Record<string, Party> = {
  // Mediation Users
  musa: { id: 'musa', name: 'Musa', role: 'Mediator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Musa' },
  ibrahim: { id: 'ibrahim', name: 'Ibrahim', role: 'Claimant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim' },
  emeka: { id: 'emeka', name: 'Emeka', role: 'Respondent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka' },
  witness1: { id: 'witness1', name: 'Witness 1', role: 'Witness', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=W1' },
  
  // Healthcare Users
  dr_aisha: { id: 'dr_aisha', name: 'Dr. Aisha', role: 'Doctor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha' },
  patient_sarah: { id: 'patient_sarah', name: 'Sarah', role: 'Patient', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  nurse_john: { id: 'nurse_john', name: 'Nurse John', role: 'Nurse', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  nutritionist_mary: { id: 'nutritionist_mary', name: 'Mary', role: 'Nutritionist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mary' },

  // Education Users
  mr_bello: { id: 'mr_bello', name: 'Mr. Bello', role: 'Teacher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bello' },
  student_fatima: { id: 'student_fatima', name: 'Fatima', role: 'Student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima' },
  parent_ahmed: { id: 'parent_ahmed', name: 'Mr. Ahmed', role: 'Parent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed' },
};

export const MOCK_VCONS: VCon[] = [
  {
    vcon: '0.0.1',
    uuid: 'conv-001',
    created_at: '2024-02-10T10:00:00Z',
    subject: 'Land Dispute: Ibrahim vs Emeka',
    parties: [PARTIES.musa, PARTIES.ibrahim, PARTIES.emeka, PARTIES.witness1],
    metadata: {
      type: 'Mediation',
      description: 'Dispute regarding the northern boundary of the farm plot in Kaduna.',
      sessions: [
        { id: 'session-0', title: 'Witness Testimony', date: '2024-02-10T10:00:00Z', status: 'closed' },
        { id: 'session-1', title: 'Initial Hearing', date: '2024-02-15T14:30:00Z', status: 'imported', importSource: 'WhatsApp' },
        { id: 'session-site-visit', title: 'Site Inspection', date: '2024-02-20T08:00:00Z', status: 'closed' },
        { id: 'session-2', title: 'Follow-up Session', date: '2024-03-05T09:15:00Z', status: 'active' },
        { id: 'session-3', title: 'Final Agreement', date: '2024-03-10T11:00:00Z', status: 'closed', importSource: 'Email' }
      ]
    },
    dialog: [
      // Session 0 - Witness Testimony (Expanded)
      {
        start: '2024-02-10T10:05:00Z',
        parties: [3], // Witness 1
        originator: 3,
        mimetype: 'audio/mp3',
        content: 'Regarding the boundary: It has always been the river. My father farmed here for 30 years, and we always knew the water\'s edge was the limit.',
        type: 'audio',
        metadata: { sessionId: 'session-0', duration: 45 }
      },
      {
        start: '2024-02-10T10:06:00Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'text/plain',
        content: 'Can you describe the specific markers you recall along the riverbank? Were there any man-made structures?',
        type: 'text',
        metadata: { sessionId: 'session-0' }
      },
      {
        start: '2024-02-10T10:07:00Z',
        parties: [3], // Witness 1
        originator: 3,
        mimetype: 'audio/mp3',
        content: 'Yes, there was a large Baobab tree near the bend, and a stone pile further north. The stone pile was maintained by the village elders.',
        type: 'audio',
        metadata: { sessionId: 'session-0', duration: 30 }
      },
      {
        start: '2024-02-10T10:08:30Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'text/plain',
        content: 'And did the river course change significantly during the rainy seasons in those years?',
        type: 'text',
        metadata: { sessionId: 'session-0' }
      },
      {
        start: '2024-02-10T10:09:15Z',
        parties: [3], // Witness 1
        originator: 3,
        mimetype: 'audio/mp3',
        content: 'It flooded, yes, but the main channel remained consistent. The Baobab tree was never submerged.',
        type: 'audio',
        metadata: { sessionId: 'session-0', duration: 25 }
      },

      // Session 1 - Initial Hearing (Expanded)
      {
        start: '2024-02-15T14:30:00Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'text/plain',
        content: 'Welcome everyone. We are here to discuss the boundary dispute regarding the northern plot. I hope we can reach an amicable resolution today.',
        type: 'text',
        metadata: { sessionId: 'session-1', importedFrom: 'WhatsApp Export' }
      },
      {
        start: '2024-02-15T14:32:00Z',
        parties: [1], // Ibrahim
        originator: 1,
        mimetype: 'text/plain',
        content: 'Thank you Musa. As I have stated, the boundary is clearly the river. It has been for generations. My family has cultivated that land since the 1980s.',
        type: 'text',
        metadata: { sessionId: 'session-1', importedFrom: 'WhatsApp Export' }
      },
      {
        start: '2024-02-15T14:35:00Z',
        parties: [2], // Emeka
        originator: 2,
        mimetype: 'text/plain',
        content: 'I disagree. The river shifts seasonally. The permanent markers were placed near the old access road. That is what the official district map shows.',
        type: 'text',
        metadata: { sessionId: 'session-1', importedFrom: 'WhatsApp Export' }
      },
      {
        start: '2024-02-15T14:36:00Z',
        parties: [1], // Ibrahim
        originator: 1,
        mimetype: 'text/plain',
        content: 'The road was built only ten years ago! The farm predates it. You are trying to claim land that was fallow because the road cut through it.',
        type: 'text',
        metadata: { sessionId: 'session-1', importedFrom: 'WhatsApp Export' }
      },
      {
        start: '2024-02-15T14:38:00Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'text/plain',
        content: 'Let us remain calm. Emeka, do you have documentation for these markers? And Ibrahim, do you have any records of the cultivation history?',
        type: 'text',
        metadata: { sessionId: 'session-1', importedFrom: 'WhatsApp Export' }
      },
      {
        start: '2024-02-15T14:40:00Z',
        parties: [2], // Emeka
        originator: 2,
        mimetype: 'text/plain',
        content: 'I have the survey from 2015. I will share it. It clearly marks the boundary 50 meters east of the river bank.',
        type: 'text',
        metadata: { sessionId: 'session-1', importedFrom: 'WhatsApp Export' }
      },
      {
        start: '2024-02-15T14:41:00Z',
        parties: [2], // Emeka
        originator: 2,
        mimetype: 'application/pdf',
        content: '2015_Land_Survey_Official.pdf',
        type: 'file',
        metadata: { sessionId: 'session-1', importedFrom: 'WhatsApp Export', size: '2.4 MB' }
      },
      {
        start: '2024-02-15T14:42:00Z',
        parties: [1], // Ibrahim
        originator: 1,
        mimetype: 'text/plain',
        content: 'That survey was done without my father present. We contested it then, and we contest it now.',
        type: 'text',
        metadata: { sessionId: 'session-1', importedFrom: 'WhatsApp Export' }
      },

      // Session - Site Inspection
      {
        start: '2024-02-20T08:00:00Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'audio/mp3',
        content: 'We are standing at the northern edge, near the river bank. Ibrahim, please point out the landmark you referred to.',
        type: 'audio',
        metadata: { sessionId: 'session-site-visit', duration: 15 }
      },
      {
        start: '2024-02-20T08:00:30Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'image/jpeg',
        content: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
        type: 'image',
        metadata: { sessionId: 'session-site-visit', caption: 'Site Overview - Northern Boundary' }
      },
      {
        start: '2024-02-20T08:01:00Z',
        parties: [1], // Ibrahim
        originator: 1,
        mimetype: 'audio/mp3',
        content: 'It is this Baobab tree here. From this trunk, the line goes straight to that white rock outcrop over there.',
        type: 'audio',
        metadata: { sessionId: 'session-site-visit', duration: 20 }
      },
      {
        start: '2024-02-20T08:01:30Z',
        parties: [1], // Ibrahim
        originator: 1,
        mimetype: 'image/jpeg',
        content: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
        type: 'image',
        metadata: { sessionId: 'session-site-visit', caption: 'The Baobab Tree Marker' }
      },
      {
        start: '2024-02-20T08:02:00Z',
        parties: [2], // Emeka
        originator: 2,
        mimetype: 'audio/mp3',
        content: 'That rock was moved during the flood of 2018! I remember it being at least 5 meters to the left.',
        type: 'audio',
        metadata: { sessionId: 'session-site-visit', duration: 15 }
      },
      {
        start: '2024-02-20T08:02:30Z',
        parties: [2], // Emeka
        originator: 2,
        mimetype: 'video/mp4',
        content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        type: 'video',
        metadata: { sessionId: 'session-site-visit', duration: 45, caption: 'Video evidence of the moved rock location' }
      },
      {
        start: '2024-02-20T08:03:00Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'audio/mp3',
        content: 'Let us look for the concrete survey pin. The map says it should be near the base of the tree.',
        type: 'audio',
        metadata: { sessionId: 'session-site-visit', duration: 10 }
      },
      {
        start: '2024-02-20T08:10:00Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'audio/mp3',
        content: 'Found it. It is indeed buried here. It aligns more with Emeka\'s claim, but the path Ibrahim uses is clearly visible.',
        type: 'audio',
        metadata: { sessionId: 'session-site-visit', duration: 30 }
      },

      // Session 2 - Follow-up (Expanded)
      {
        start: '2024-03-05T09:15:00Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'text/plain',
        content: 'Let us review the claims today based on the documents submitted. I have reviewed the 2015 survey and the 1990 district map.',
        type: 'text',
        metadata: { sessionId: 'session-2' }
      },
      {
        start: '2024-03-05T09:18:00Z',
        parties: [1], // Ibrahim
        originator: 1,
        mimetype: 'text/plain',
        content: 'I have checked my records. The boundary is the old road, past the large tree.',
        type: 'text',
        metadata: { sessionId: 'session-2' }
      },
      {
        start: '2024-03-05T09:20:00Z',
        parties: [2], // Emeka
        originator: 2,
        mimetype: 'text/plain',
        content: 'Wait, last time you said it was the river. Now you agree it is the road? This is confusing.',
        type: 'text',
        metadata: { sessionId: 'session-2' }
      },
      {
        start: '2024-03-05T09:21:00Z',
        parties: [1], // Ibrahim
        originator: 1,
        mimetype: 'text/plain',
        content: 'I... I misspoke. I meant the path near the river. The path that looks like a road.',
        type: 'text',
        metadata: { sessionId: 'session-2' }
      },
      {
        start: '2024-03-05T09:22:00Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'text/plain',
        content: 'This is a significant change in your statement, Ibrahim. Please clarify. Are you referring to the footpath used by fishermen?',
        type: 'text',
        metadata: { sessionId: 'session-2' }
      },
      {
        start: '2024-03-05T09:25:00Z',
        parties: [1], // Ibrahim
        originator: 1,
        mimetype: 'text/plain',
        content: 'The "old road" I mentioned is just a dirt path that follows the river bank. It is the same line. I was confused by the terminology.',
        type: 'text',
        metadata: { sessionId: 'session-2' }
      },
      {
        start: '2024-03-05T09:28:00Z',
        parties: [2], // Emeka
        originator: 2,
        mimetype: 'text/plain',
        content: 'That path floods every year. It cannot be a permanent boundary. The survey stones are on higher ground.',
        type: 'text',
        metadata: { sessionId: 'session-2' }
      },
      {
        start: '2024-03-05T09:35:00Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'text/plain',
        content: 'Emeka, are you willing to concede access to the river for Ibrahim\'s cattle, even if the boundary is confirmed at the survey line?',
        type: 'text',
        metadata: { sessionId: 'session-2' }
      },
      {
        start: '2024-03-05T09:38:00Z',
        parties: [2], // Emeka
        originator: 2,
        mimetype: 'text/plain',
        content: 'I am willing to allow a 5-meter easement for water access, provided no permanent structures are built there.',
        type: 'text',
        metadata: { sessionId: 'session-2' }
      },

      // Session 3 - Final Agreement (New)
      {
        start: '2024-03-10T11:00:00Z',
        parties: [0], // Musa
        originator: 0,
        mimetype: 'text/plain',
        content: 'Attached is the final agreement draft based on the 2015 survey and witness testimony. It includes the 5-meter easement clause.',
        type: 'text',
        metadata: { sessionId: 'session-3', importedFrom: 'Email' }
      },
      {
        start: '2024-03-10T11:05:00Z',
        parties: [1], // Ibrahim
        originator: 1,
        mimetype: 'text/plain',
        content: 'I accept the terms. The survey is accurate enough, and the water access was my main concern.',
        type: 'text',
        metadata: { sessionId: 'session-3', importedFrom: 'Email' }
      },
      {
        start: '2024-03-10T11:10:00Z',
        parties: [2], // Emeka
        originator: 2,
        mimetype: 'text/plain',
        content: 'Agreed. I will sign the hard copy tomorrow. Thank you for mediating this, Musa.',
        type: 'text',
        metadata: { sessionId: 'session-3', importedFrom: 'Email' }
      }
    ],
    attachments: [],
    analysis: []
  },
  {
    vcon: '0.0.1',
    uuid: 'conv-002',
    created_at: '2024-01-15T09:00:00Z',
    subject: 'Chronic Condition Management',
    parties: [PARTIES.dr_aisha, PARTIES.patient_sarah, PARTIES.nurse_john, PARTIES.nutritionist_mary],
    metadata: {
      type: 'Healthcare',
      description: 'Quarterly review for Type 2 Diabetes management and lifestyle adjustments.',
      sessions: [
        { id: 'session-hc-0', title: 'Initial Consultation', date: '2023-12-10T08:30:00Z', status: 'imported', importSource: 'Clinic Notes' },
        { id: 'session-hc-1', title: 'Q1 Review', date: '2024-01-15T09:00:00Z', status: 'closed' },
        { id: 'session-hc-diet', title: 'Nutrition Consultation', date: '2024-02-20T11:00:00Z', status: 'closed' },
        { id: 'session-hc-2', title: 'Q2 Follow-up', date: '2024-04-10T10:00:00Z', status: 'active' }
      ]
    },
    dialog: [
      {
        start: '2023-12-10T08:30:00Z',
        parties: [0], // Dr. Aisha
        originator: 0,
        mimetype: 'text/plain',
        content: 'Patient presents with elevated glucose levels (240 mg/dL). Initiating Metformin 500mg twice daily with meals.',
        type: 'text',
        metadata: { sessionId: 'session-hc-0', importedFrom: 'Clinic Notes' }
      },
      {
        start: '2023-12-10T08:35:00Z',
        parties: [1], // Sarah
        originator: 1,
        mimetype: 'text/plain',
        content: 'I have been feeling very tired lately and thirsty all the time. My vision also gets blurry sometimes in the afternoon.',
        type: 'text',
        metadata: { sessionId: 'session-hc-0', importedFrom: 'Clinic Notes' }
      },
      {
        start: '2023-12-10T08:40:00Z',
        parties: [2], // Nurse John
        originator: 2,
        mimetype: 'text/plain',
        content: 'Patient education provided on glucose monitoring and low-carb diet. Demo unit for glucometer provided.',
        type: 'text',
        metadata: { sessionId: 'session-hc-0', importedFrom: 'Clinic Notes' }
      },
      
      // Session 1 - Q1 Review
      {
        start: '2024-01-15T09:00:00Z',
        parties: [0], // Dr. Aisha
        originator: 0,
        mimetype: 'text/plain',
        content: 'Sarah, welcome back. How have you been adjusting to the medication?',
        type: 'text',
        metadata: { sessionId: 'session-hc-1' }
      },
      {
        start: '2024-01-15T09:02:00Z',
        parties: [1], // Sarah
        originator: 1,
        mimetype: 'text/plain',
        content: 'The first week was rough, lots of stomach upset. But it has settled down now. I am taking it with food as you said.',
        type: 'text',
        metadata: { sessionId: 'session-hc-1' }
      },
      {
        start: '2024-01-15T09:05:00Z',
        parties: [0], // Dr. Aisha
        originator: 0,
        mimetype: 'text/plain',
        content: 'That is common. I am glad it subsided. Your log shows morning fasting numbers around 140. We want to get that under 120.',
        type: 'text',
        metadata: { sessionId: 'session-hc-1' }
      },

      // Session - Nutrition Consultation
      {
        start: '2024-02-20T11:00:00Z',
        parties: [3], // Mary
        originator: 3,
        mimetype: 'text/plain',
        content: 'Hello Sarah. Dr. Aisha asked me to review your meal logs. I see you are doing well with breakfast, but dinner seems heavy on carbohydrates.',
        type: 'text',
        metadata: { sessionId: 'session-hc-diet' }
      },
      {
        start: '2024-02-20T11:02:00Z',
        parties: [1], // Sarah
        originator: 1,
        mimetype: 'text/plain',
        content: 'Yes, it is hard because my family loves rice and yam. I cook for everyone.',
        type: 'text',
        metadata: { sessionId: 'session-hc-diet' }
      },
      {
        start: '2024-02-20T11:05:00Z',
        parties: [3], // Mary
        originator: 3,
        mimetype: 'text/plain',
        content: 'I understand. You do not have to cook separate meals. Try substituting half the rice with steamed vegetables or using bulgur wheat instead. Portion control is key.',
        type: 'text',
        metadata: { sessionId: 'session-hc-diet' }
      },
      {
        start: '2024-02-20T11:08:00Z',
        parties: [1], // Sarah
        originator: 1,
        mimetype: 'text/plain',
        content: 'I can try that. What about fruits? I was told to avoid them.',
        type: 'text',
        metadata: { sessionId: 'session-hc-diet' }
      },
      {
        start: '2024-02-20T11:10:00Z',
        parties: [3], // Mary
        originator: 3,
        mimetype: 'text/plain',
        content: 'Not all fruits. Berries and green apples are fine in moderation. Avoid fruit juices entirely; they spike your sugar too fast.',
        type: 'text',
        metadata: { sessionId: 'session-hc-diet' }
      },

      // Session 2 - Q2 Follow-up
      {
        start: '2024-04-10T10:00:00Z',
        parties: [0], // Dr. Aisha
        originator: 0,
        mimetype: 'text/plain',
        content: 'Good morning Sarah. How have your glucose levels been this month? I see you have uploaded your log.',
        type: 'text',
        metadata: { sessionId: 'session-hc-2' }
      },
      {
        start: '2024-04-10T10:02:00Z',
        parties: [1], // Sarah
        originator: 1,
        mimetype: 'text/plain',
        content: 'Better than last time. I have been walking every evening for 30 minutes. My husband joins me, which helps.',
        type: 'text',
        metadata: { sessionId: 'session-hc-2' }
      },
      {
        start: '2024-04-10T10:03:00Z',
        parties: [2], // Nurse John
        originator: 2,
        mimetype: 'text/plain',
        content: 'Her latest A1C results came in at 6.8, down from 7.2. Weight is down 2kg as well.',
        type: 'text',
        metadata: { sessionId: 'session-hc-2' }
      },
      {
        start: '2024-04-10T10:04:00Z',
        parties: [0], // Dr. Aisha
        originator: 0,
        mimetype: 'text/plain',
        content: 'That is excellent progress. Are you still experiencing any dizziness in the mornings?',
        type: 'text',
        metadata: { sessionId: 'session-hc-2' }
      },
      {
        start: '2024-04-10T10:05:00Z',
        parties: [1], // Sarah
        originator: 1,
        mimetype: 'text/plain',
        content: 'Occasionally, but only if I skip the bedtime snack you recommended. The greek yogurt seems to help stabilize it.',
        type: 'text',
        metadata: { sessionId: 'session-hc-2' }
      },
      {
        start: '2024-04-10T10:06:00Z',
        parties: [0], // Dr. Aisha
        originator: 0,
        mimetype: 'text/plain',
        content: 'Okay, let us keep the current dosage of Metformin. I want you to focus on increasing fiber intake at lunch. John, please schedule the next blood work for July.',
        type: 'text',
        metadata: { sessionId: 'session-hc-2' }
      },
      {
        start: '2024-04-10T10:07:00Z',
        parties: [2], // Nurse John
        originator: 2,
        mimetype: 'text/plain',
        content: 'Noted, Doctor. I will also refill the prescription today. Sarah, do you need more test strips?',
        type: 'text',
        metadata: { sessionId: 'session-hc-2' }
      },
      {
        start: '2024-04-10T10:08:00Z',
        parties: [1], // Sarah
        originator: 1,
        mimetype: 'text/plain',
        content: 'Yes please, I am running low on the lancets too.',
        type: 'text',
        metadata: { sessionId: 'session-hc-2' }
      }
    ],
    attachments: [],
    analysis: []
  },
  {
    vcon: '0.0.1',
    uuid: 'conv-003',
    created_at: '2024-03-20T14:00:00Z',
    subject: 'Academic Counseling: Fatima',
    parties: [PARTIES.mr_bello, PARTIES.student_fatima, PARTIES.parent_ahmed],
    metadata: {
      type: 'Education',
      description: 'Review of term performance and university application strategy.',
      sessions: [
        { id: 'session-ed-0', title: 'Parent-Teacher Email', date: '2024-02-01T10:00:00Z', status: 'imported', importSource: 'Email' },
        { id: 'session-ed-mock', title: 'Mock Interview', date: '2024-03-15T15:00:00Z', status: 'closed' },
        { id: 'session-ed-1', title: 'Term Review', date: '2024-03-20T14:00:00Z', status: 'active' }
      ]
    },
    dialog: [
      {
        start: '2024-02-01T10:00:00Z',
        parties: [2], // Mr. Ahmed
        originator: 2,
        mimetype: 'text/plain',
        content: 'Dear Mr. Bello, we are concerned about Fatima\'s physics grade. She scored a C in the mock exams. Can we schedule a meeting to discuss support?',
        type: 'text',
        metadata: { sessionId: 'session-ed-0', importedFrom: 'Email' }
      },
      {
        start: '2024-02-01T14:00:00Z',
        parties: [0], // Mr. Bello
        originator: 0,
        mimetype: 'text/plain',
        content: 'Mr. Ahmed, I assure you she is capable. The mock exam was particularly difficult this year. I suggest extra tutoring sessions starting next week to focus on mechanics.',
        type: 'text',
        metadata: { sessionId: 'session-ed-0', importedFrom: 'Email' }
      },
      
      // Session - Mock Interview
      {
        start: '2024-03-15T15:00:00Z',
        parties: [0], // Mr. Bello
        originator: 0,
        mimetype: 'text/plain',
        content: 'Okay Fatima, let us pretend this is the scholarship interview. Tell me, why did you choose Mechatronics?',
        type: 'text',
        metadata: { sessionId: 'session-ed-mock' }
      },
      {
        start: '2024-03-15T15:01:00Z',
        parties: [1], // Fatima
        originator: 1,
        mimetype: 'text/plain',
        content: 'I... I like building things. And I want to solve problems in Nigeria using automation.',
        type: 'text',
        metadata: { sessionId: 'session-ed-mock' }
      },
      {
        start: '2024-03-15T15:02:00Z',
        parties: [0], // Mr. Bello
        originator: 0,
        mimetype: 'text/plain',
        content: 'That is a good start, but it is too generic. Give me a specific example of a problem you solved.',
        type: 'text',
        metadata: { sessionId: 'session-ed-mock' }
      },
      {
        start: '2024-03-15T15:03:00Z',
        parties: [1], // Fatima
        originator: 1,
        mimetype: 'text/plain',
        content: 'Well, in the robotics club, our solar tracker kept getting stuck because of dust. I designed a wiper mechanism using an old servo motor to clean the sensor automatically.',
        type: 'text',
        metadata: { sessionId: 'session-ed-mock' }
      },
      {
        start: '2024-03-15T15:04:00Z',
        parties: [0], // Mr. Bello
        originator: 0,
        mimetype: 'text/plain',
        content: 'Excellent! That is the story you need to tell. It shows innovation and practical skills. Write that down.',
        type: 'text',
        metadata: { sessionId: 'session-ed-mock' }
      },

      // Session 1 - Term Review
      {
        start: '2024-03-20T14:05:00Z',
        parties: [0], // Mr. Bello
        originator: 0,
        mimetype: 'text/plain',
        content: 'Fatima, welcome. Mr. Ahmed, good to see you. Let us start with the good news: your physics scores have improved significantly. You got an A- in the latest assessment.',
        type: 'text',
        metadata: { sessionId: 'session-ed-1' }
      },
      {
        start: '2024-03-20T14:06:00Z',
        parties: [1], // Fatima
        originator: 1,
        mimetype: 'text/plain',
        content: 'Thank you sir. I started the extra tutoring sessions and they really helped with the calculation questions.',
        type: 'text',
        metadata: { sessionId: 'session-ed-1' }
      },
      {
        start: '2024-03-20T14:08:00Z',
        parties: [2], // Mr. Ahmed
        originator: 2,
        mimetype: 'text/plain',
        content: 'We are very proud. The tutor says she is very dedicated. What are the next steps for the application? We are worried about the timeline.',
        type: 'text',
        metadata: { sessionId: 'session-ed-1' }
      },
      {
        start: '2024-03-20T14:10:00Z',
        parties: [0], // Mr. Bello
        originator: 0,
        mimetype: 'text/plain',
        content: 'We need to finalize her personal statement. The deadline for ABU Zaria is next month. Have you narrowed down your course choices?',
        type: 'text',
        metadata: { sessionId: 'session-ed-1' }
      },
      {
        start: '2024-03-20T14:12:00Z',
        parties: [1], // Fatima
        originator: 1,
        mimetype: 'text/plain',
        content: 'Yes, I want to apply for Mechatronics Engineering as first choice, and Computer Engineering as second. I have a draft statement ready. I focused on my robotics project.',
        type: 'text',
        metadata: { sessionId: 'session-ed-1' }
      },
      {
        start: '2024-03-20T14:15:00Z',
        parties: [0], // Mr. Bello
        originator: 0,
        mimetype: 'text/plain',
        content: 'That is a strong topic. Mechatronics is competitive, so highlighting the robotics club leadership is key. Bring the draft to my office tomorrow, and we will review the structure.',
        type: 'text',
        metadata: { sessionId: 'session-ed-1' }
      },
      {
        start: '2024-03-20T14:18:00Z',
        parties: [2], // Mr. Ahmed
        originator: 2,
        mimetype: 'text/plain',
        content: 'Should she also mention her volunteer work at the hospital? Or is that irrelevant for engineering?',
        type: 'text',
        metadata: { sessionId: 'session-ed-1' }
      },
      {
        start: '2024-03-20T14:20:00Z',
        parties: [0], // Mr. Bello
        originator: 0,
        mimetype: 'text/plain',
        content: 'It shows character and community service, which is good. But keep it brief. 80% should be about her technical interest and aptitude.',
        type: 'text',
        metadata: { sessionId: 'session-ed-1' }
      }
    ],
    attachments: [],
    analysis: []
  }
];
