import bcrypt from "bcryptjs"
import { PrismaClient, PublishStatus, UserRoleName } from "@prisma/client"

const prisma = new PrismaClient()

const services = [
  ["Corporate Events", "corporate-events", "End-to-end corporate event planning, logistics, production, and guest experience management."],
  ["Tours & Travel", "tours-travel", "Custom travel coordination for leisure, groups, retreats, and business movement."],
  ["Wellness Retreats", "wellness-retreats", "Curated wellness escapes, group retreats, and mindful experience planning."],
  ["Branding & Marketing", "branding-marketing", "Brand identity, campaigns, launch support, and strategic marketing execution."],
  ["Photography & Videography", "photography-videography", "Professional coverage for events, campaigns, spaces, products, and people."],
  ["Artist Management", "artist-management", "Artist discovery, booking, coordination, and event performance management."],
  ["Venue Sourcing", "venue-sourcing", "Venue discovery and negotiation for events, retreats, shoots, and meetings."],
  ["Team Building Activities", "team-building-activities", "Structured team experiences that improve connection, morale, and collaboration."],
  ["Real Estate", "real-estate", "Property support for buying, selling, renting, leasing, and location advisory."],
  ["Astrology", "astrology", "Consultation coordination for personal, family, and business guidance."],
  ["Finance", "finance", "Financial requirement discovery and consultation routing for qualified enquiries."],
  ["Health & Wellness", "health-wellness", "Health, lifestyle, and wellness service coordination with trusted partners."],
  ["Other", "other", "Custom requirements routed to the right Taakshvi team member."],
]

const permissions = [
  "leads.read",
  "leads.write",
  "cms.read",
  "cms.write",
  "gallery.write",
  "testimonials.write",
  "settings.write",
  "users.manage",
  "analytics.read",
]

const routingRules = [
  { serviceSlug: "astrology", mobile: "9833031572", whatsapp: "9833031572", reason: "Astrology" },
  { serviceSlug: "finance", mobile: "9326277096", whatsapp: "9326277096", reason: "Finance" },
  { serviceSlug: "tours-travel", mobile: "8460623469", whatsapp: "8460623469", reason: "Travel" },
  { serviceSlug: "health-wellness", mobile: "8460623469", whatsapp: "8460623469", reason: "Health & Wellness" },
  { serviceSlug: "real-estate", city: "Ahmedabad", mobile: "8460623469", whatsapp: "8460623469", reason: "Real Estate Ahmedabad" },
  { serviceSlug: "real-estate", mobile: "7977938960", whatsapp: "7977938960", reason: "Real Estate Other" },
  { mobile: "7977938960", whatsapp: "7977938960", reason: "Default" },
]

const blogPosts = [
  {
    slug: "premium-corporate-event-planning-checklist",
    title: "Premium Corporate Event Planning Checklist for Teams That Need Zero Chaos",
    shortDescription: "A practical guide to designing corporate events that feel polished to guests and manageable to internal teams.",
    tags: ["Corporate Events", "Planning", "Operations"],
    publishDate: "2026-06-15",
    content: `Premium events rarely feel premium by accident.

The quality a guest notices is usually the result of invisible planning choices: arrival flow, stage transitions, hospitality timing, technical backup, and a clear point of ownership.

For internal teams, the goal is not only a good-looking event. It is an event that does not become an operational fire drill.

Start with the outcome. Is the event meant to celebrate, align a team, launch a product, strengthen a client relationship, or create media? The answer affects venue format, production intensity, guest list design, and content pacing.

Next, protect the guest journey. Registration, parking, reception, seating, catering, and departure all shape perception as much as the stage program.

Finally, define post-event follow-through. Premium service includes what happens after the lights go off: thank-you communication, lead capture, vendor wrap-up, media delivery, and internal reporting.

Teams that plan these layers early usually spend less time solving avoidable problems later.`,
  },
  {
    slug: "team-offsites-that-actually-improve-culture",
    title: "How to Plan Team Offsites That Actually Improve Culture",
    shortDescription: "Why most offsites underperform and how thoughtful structure creates better team outcomes.",
    tags: ["Corporate Events", "Team Building", "Culture"],
    publishDate: "2026-06-13",
    content: `An offsite should not feel like a random break from work.

The best offsites create the conditions for better alignment, stronger trust, and more useful cross-functional conversation.

That starts with one uncomfortable question: what specific behavior should improve after the offsite?

If leaders cannot answer that, the event usually becomes a mix of logistics, activity planning, and generic motivation without a durable business result.

Good offsites balance energy with structure. They use movement, reflection, informal conversation, and a few well-designed sessions instead of over-programming every hour.

The setting matters, but the sequence matters more. Team mood rises when the flow feels intentional and people are not rushed from one item to the next.

A well-run offsite leaves the team with more clarity, not just more photos.`,
  },
  {
    slug: "travel-itineraries-for-founder-retreats",
    title: "Building Travel Itineraries for Founder Retreats and Leadership Groups",
    shortDescription: "A guide to designing travel experiences that support reflection, connection, and pace.",
    tags: ["Travel", "Retreats", "Leadership"],
    publishDate: "2026-06-11",
    content: `Founder retreats and leadership trips fail when the itinerary behaves like a rushed holiday.

These journeys need room for conversation, private thought, and meaningful shared time.

When planning them, the first decision is not the destination. It is the energy profile of the trip. Some groups need stimulation and movement. Others need calm, slower pacing, and a more protected schedule.

Transfers, check-in timing, meal windows, and work-session spacing matter more than people expect.

A good itinerary also separates optional from essential experiences. That keeps the group flexible without creating confusion.

Well-designed retreat travel feels light to the guest because the planning is heavy before the trip begins.`,
  },
  {
    slug: "wellness-retreat-design-beyond-yoga-schedules",
    title: "Designing Wellness Retreats Beyond a Yoga Schedule",
    shortDescription: "What makes a retreat feel restorative, credible, and worth recommending.",
    tags: ["Wellness", "Retreats", "Experience Design"],
    publishDate: "2026-06-09",
    content: `A wellness retreat is not premium simply because it includes yoga and a scenic venue.

The real product is emotional pace.

Guests should understand when to engage, when to rest, and when to reflect. That means the schedule should protect transitions, not cram them.

Food, room quality, lighting, instructor briefing, arrival messaging, and the tone of facilitation all shape whether guests feel cared for or processed.

The strongest retreat programs avoid over-explaining wellness. They let the environment, service quality, and programming create the effect.

Retreats become memorable when people leave lighter than they arrived, and that requires operational discipline as much as intention.`,
  },
  {
    slug: "destination-weddings-vs-corporate-travel-ops",
    title: "What Destination Weddings and Corporate Travel Ops Secretly Have in Common",
    shortDescription: "Shared logistics lessons from two very different kinds of high-pressure planning.",
    tags: ["Travel", "Logistics", "Events"],
    publishDate: "2026-06-06",
    content: `On the surface, destination weddings and corporate travel programs appear unrelated.

In practice, both involve guest movement, timing risk, vendor reliability, accommodation decisions, and the emotional cost of mistakes.

That is why the strongest operators think in systems rather than moments.

Manifest tracking, check-in windows, transport redundancy, hospitality handoffs, and live communication channels reduce friction in both worlds.

The difference is mostly in tone. The operations discipline underneath is remarkably similar.

Clients notice calm. Calm is usually the result of structured prep behind the scenes.`,
  },
  {
    slug: "how-branding-supports-premium-service-businesses",
    title: "How Branding Supports Premium Service Businesses Before the First Call",
    shortDescription: "Why visual consistency and message clarity increase trust before a conversation even starts.",
    tags: ["Branding", "Marketing", "Trust"],
    publishDate: "2026-06-04",
    content: `For service businesses, branding is not decoration.

It is often the first signal of how seriously a client should take the company.

If the website, deck, WhatsApp follow-up, social presence, and enquiry experience all feel disconnected, the brand feels unstable even if the team is capable.

Premium branding creates confidence through consistency. It tells a client that the business can manage detail.

That does not mean everything has to feel luxurious in the same way. It means the tone, quality bar, and level of care should feel deliberate everywhere.

Good branding shortens trust-building time because the experience already feels coherent.`,
  },
  {
    slug: "service-launch-content-that-drives-qualified-leads",
    title: "Service Launch Content That Drives Qualified Leads Instead of Empty Traffic",
    shortDescription: "How to publish launch content that attracts visitors with actual intent.",
    tags: ["Marketing", "Lead Generation", "Content"],
    publishDate: "2026-06-01",
    content: `Traffic is not the same as useful demand.

When launching a service, many brands publish content that sounds broad and energetic but does not help a serious prospect self-qualify.

Useful launch content does three things: explains the problem clearly, shows the kind of client fit the service is built for, and tells the visitor what happens next.

It should remove uncertainty rather than create more of it.

The most effective pieces feel specific enough to earn trust but structured enough to scale across channels.

If content improves the quality of the first enquiry, it is doing its job.`,
  },
  {
    slug: "real-estate-enquiry-flows-that-filter-serious-buyers",
    title: "Real Estate Enquiry Flows That Filter Serious Buyers Without Slowing Them Down",
    shortDescription: "Lead forms and follow-up structures that improve clarity for property enquiries.",
    tags: ["Real Estate", "CRM", "Lead Qualification"],
    publishDate: "2026-05-29",
    content: `Property leads can become noisy fast.

That is why the enquiry experience should gather just enough information to create context without making serious buyers abandon the form.

Budget, location, timeline, property type, and intent are usually more useful than long open-ended text.

The follow-up flow matters just as much. A quick response without clarity creates work for everyone. A delayed response weakens trust.

The best real estate enquiry systems balance speed with qualification so the next conversation starts with useful signal, not guesswork.`,
  },
  {
    slug: "finance-consultation-intake-questions-that-save-time",
    title: "Finance Consultation Intake Questions That Save Time for Both Sides",
    shortDescription: "A better way to structure discovery for financial service enquiries.",
    tags: ["Finance", "Discovery", "Consultation"],
    publishDate: "2026-05-27",
    content: `Financial conversations become more productive when the intake is structured before the first call.

That does not mean forcing prospects through a cold form. It means asking a small set of questions that define intent, current context, urgency, and preferred conversation mode.

The point is to reduce confusion, not add friction.

When discovery starts clearly, advisors spend less time establishing basics and more time giving relevant guidance.

Clients feel that difference immediately.`,
  },
  {
    slug: "artist-management-briefs-that-prevent-last-minute-panic",
    title: "Artist Management Briefs That Prevent Last-Minute Panic",
    shortDescription: "What organisers should define before artist bookings move into execution.",
    tags: ["Artist Management", "Events", "Planning"],
    publishDate: "2026-05-24",
    content: `Artist coordination often looks glamorous from the outside and chaotic on the inside.

Most stress comes from vague briefs, incomplete technical expectations, unclear hospitality needs, and weak ownership between organiser, manager, and venue.

A solid artist brief defines show timing, sound requirements, green-room expectations, travel, billing flow, and contingency contacts.

When those details are settled early, the event day becomes dramatically calmer.

Good artist management is mostly about reducing ambiguity before the spotlight turns on.`,
  },
  {
    slug: "venue-sourcing-questions-to-ask-before-shortlisting",
    title: "Venue Sourcing Questions to Ask Before You Even Shortlist",
    shortDescription: "A faster way to narrow venues based on fit, function, and guest experience.",
    tags: ["Venue Sourcing", "Events", "Decision Making"],
    publishDate: "2026-05-21",
    content: `Venue shortlists get expensive when they are driven by aesthetics alone.

Before visiting properties, define the format, audience size, arrival pattern, technical expectations, and non-negotiable guest comforts.

This filters the list far better than saving dozens of attractive options.

A venue should support the event logic, not force the team to redesign the event around its constraints.

When shortlisting is disciplined, site visits become decision moments instead of endless browsing.`,
  },
  {
    slug: "photography-briefs-for-brands-that-need-better-assets",
    title: "Photography Briefs for Brands That Need Better Assets, Not Just More Photos",
    shortDescription: "How brands can brief image-making work so the output is usable across channels.",
    tags: ["Photography", "Branding", "Content"],
    publishDate: "2026-05-18",
    content: `Too many shoots produce a folder full of images and very little actual business utility.

The issue is rarely the photographer alone. It is usually the brief.

A useful brief explains where the images will live, what emotions or claims they need to support, and what formats the business truly needs.

That creates sharper shot planning and fewer random outputs.

When photography is planned as a business asset instead of an isolated creative task, the quality of decision-making improves on both sides.`,
  },
  {
    slug: "health-wellness-programs-that-feel-premium-not-preachy",
    title: "Health and Wellness Programs That Feel Premium, Not Preachy",
    shortDescription: "A practical look at designing wellness offers people actually want to engage with.",
    tags: ["Health & Wellness", "Experience", "Positioning"],
    publishDate: "2026-05-15",
    content: `Wellness branding often becomes ineffective when it starts sounding moralistic.

People usually respond better to clarity, credibility, and ease than to pressure.

Premium wellness programs feel well-held. They make booking simple, reduce uncertainty, and create a calm service environment without over-promising transformation.

The positioning should respect the customer rather than trying to lecture them into action.

That shift alone can make a service feel much more modern and trustworthy.`,
  },
  {
    slug: "astrology-consultation-experience-design",
    title: "Designing an Astrology Consultation Experience That Feels Personal and Professional",
    shortDescription: "How service framing shapes trust in a sensitive consultation category.",
    tags: ["Astrology", "Consultation", "Customer Experience"],
    publishDate: "2026-05-12",
    content: `Astrology sits in a sensitive part of the service economy because clients often approach it with strong expectations, private concerns, or uncertainty.

That makes the service experience especially important.

Booking, intake, consultation mode, confidentiality, and post-session clarity all affect whether the experience feels thoughtful or transactional.

Premium delivery in this category comes from tone and structure. The customer should feel guided, respected, and clear about the next step.

Operational professionalism strengthens trust in categories where trust is the whole product.`,
  },
  {
    slug: "team-building-format-guide-indoor-outdoor-hybrid",
    title: "Choosing Between Indoor, Outdoor, and Hybrid Team Building Formats",
    shortDescription: "A decision guide for organisers planning team activities with different energy goals.",
    tags: ["Team Building", "Corporate Events", "Format"],
    publishDate: "2026-05-09",
    content: `Team building works best when the format matches the emotional and logistical reality of the group.

Indoor sessions support discussion, strategy, and controlled facilitation. Outdoor formats help with energy, movement, and novelty. Hybrid structures can combine both when the schedule allows.

The right choice depends on weather, travel tolerance, team comfort, and the purpose of the day.

When organisers choose format first and objective second, the activity can look good on paper but miss the actual need.

A useful format decision begins with group energy, not trend-following.`,
  },
  {
    slug: "why-multi-service-brands-need-a-single-crm-view",
    title: "Why Multi-Service Brands Need a Single CRM View",
    shortDescription: "The operational case for combining lead capture, routing, content, and follow-up in one system.",
    tags: ["CRM", "Operations", "Growth"],
    publishDate: "2026-05-06",
    content: `When a business spans multiple service lines, confusion often hides in the handoff between marketing and execution.

One enquiry may touch branding, travel, and event support at the same time. If each line operates separately, the client experiences delay and duplication.

A single CRM view helps teams preserve context while keeping ownership visible.

It also improves reporting, content planning, and follow-up quality because activity is not scattered across personal tools.

For multi-service brands, central visibility is not just an admin feature. It is part of the customer experience.`,
  },
]

const newsPosts = [
  {
    slug: "gujarati-wellness-retreat-coverage",
    title: "Gujarati Media Coverage Highlights Taakshvi Wellness Retreat Experience",
    shortDescription: "Regional coverage spotlighted the immersive structure, destination quality, and guest response to a Taakshvi-led wellness experience.",
    tags: ["Wellness", "Media Coverage"],
    sourceName: "Divya Bhaskar",
    newsUrl: "https://divya.bhaskar.com/wbUX9WFpX3b",
    publishDate: "2026-06-14",
    content: `Coverage from Gujarati media focused on the way the retreat combined atmosphere, planning discipline, and restorative programming.

For Taakshvi, this kind of mention matters because it validates that experience quality is visible to people outside the immediate guest list.

The report also reinforced the broader positioning of Taakshvi as a solution hub that can deliver both operational control and emotional resonance in wellness-led formats.`,
  },
  {
    slug: "bs9-tv-coverage-taakshvi-experience",
    title: "BS9 TV Coverage Captures Public Response to a Taakshvi-Led Experience",
    shortDescription: "Video-led television-style coverage showed audience energy, presentation quality, and real-time brand visibility.",
    tags: ["Media Coverage", "Events"],
    sourceName: "BS9 TV",
    newsUrl: "https://www.facebook.com/share/v/1DDm5YnxcU/",
    publishDate: "2026-06-10",
    content: `BS9 TV style coverage highlighted the visible execution layer of the experience, including crowd energy, staging quality, and on-ground coordination.

Public-facing footage is especially useful for service businesses because it lets new visitors judge confidence, scale, and activity quickly.

This type of mention supports the trust-building role of the news section on the Taakshvi platform.`,
  },
  {
    slug: "video-coverage-of-taakshvi-programme",
    title: "YouTube Video Coverage Extends the Reach of a Taakshvi Programme",
    shortDescription: "A published video reference now gives visitors a richer view of event atmosphere and execution quality.",
    tags: ["Video Coverage", "Brand Trust"],
    sourceName: "YouTube Coverage",
    newsUrl: "https://youtu.be/ujEAn4u1A28",
    publishDate: "2026-06-07",
    content: `Video coverage gives prospective clients something static photos often cannot: pace, mood, crowd response, and a stronger sense of delivery quality.

This reference helps the website show that Taakshvi is not only publishing claims but also pointing visitors toward externally visible proof.

That matters for premium service businesses where trust is often built before the first direct conversation.`,
  },
]

const galleryItems = [
  { id: "gallery-1", title: "Corporate Stage Experience", type: "IMAGE", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80", category: "Events", serviceSlug: "corporate-events" },
  { id: "gallery-2", title: "Island Travel Escape", type: "IMAGE", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80", category: "Travel", serviceSlug: "tours-travel" },
  { id: "gallery-3", title: "Wellness Retreat Session", type: "IMAGE", url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80", category: "Wellness", serviceSlug: "wellness-retreats" },
  { id: "gallery-4", title: "Luxury Property Showcase", type: "IMAGE", url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80", category: "Real Estate", serviceSlug: "real-estate" },
  { id: "gallery-5", title: "Campaign Production Moment", type: "IMAGE", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80", category: "Photography", serviceSlug: "photography-videography" },
  { id: "gallery-6", title: "Branded Venue Evening", type: "IMAGE", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80", category: "Events", serviceSlug: "branding-marketing" },
]

const testimonials = [
  {
    id: "seed-testimonial-1",
    name: "Priya Desai",
    company: "Corporate Events",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    review: "Taakshvi handled the entire event requirement with clarity, fast follow-up, and calm execution. The experience felt premium at every step.",
  },
  {
    id: "seed-testimonial-2",
    name: "Rohit Mehta",
    company: "Branding & Marketing",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    review: "The biggest difference was accountability. We always knew who owned the next step and did not have to chase updates.",
  },
  {
    id: "seed-testimonial-3",
    name: "Amit Sharma",
    company: "Team Building Activities",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    rating: 4,
    review: "From the initial brief to team activity planning, the workflow felt organised and thoughtful. It saved our internal team real time.",
  },
  {
    id: "seed-testimonial-4",
    name: "Kavya Shah",
    company: "Real Estate",
    photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    review: "The brand experience felt polished, but the operational discipline behind it was what really built trust for us.",
  },
  {
    id: "seed-testimonial-5",
    name: "Nisha Kapoor",
    company: "Wellness Retreats",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    review: "The retreat felt calm, elegant, and beautifully paced. Guests kept talking about how cared for they felt throughout the journey.",
  },
  {
    id: "seed-testimonial-6",
    name: "Sanket Trivedi",
    company: "Tours & Travel",
    photo: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    review: "Our travel planning became dramatically easier once Taakshvi stepped in. Every transfer, stay, and guest touchpoint felt better organised.",
  },
  {
    id: "seed-testimonial-7",
    name: "Mitali Joshi",
    company: "Photography & Videography",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    rating: 4,
    review: "The team understood the visual standard we wanted and translated it into a much more polished content experience than we had before.",
  },
  {
    id: "seed-testimonial-8",
    name: "Harsh Vora",
    company: "Finance",
    photo: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    review: "What stood out was the quality of the consultation flow. It felt personal, professional, and genuinely helpful from the first interaction.",
  },
  {
    id: "seed-testimonial-9",
    name: "Riddhi Patel",
    company: "Venue Sourcing",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    review: "Venue shortlisting became much faster because the brief was understood properly. We saw better options and wasted less time.",
  },
  {
    id: "seed-testimonial-10",
    name: "Devansh Malhotra",
    company: "Artist Management",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    review: "The coordination quality made the whole event feel more secure. Artist-side communication and event-side execution stayed aligned throughout.",
  },
]

function toMetaDescription(value) {
  return value.length > 155 ? `${value.slice(0, 152)}...` : value
}

async function main() {
  for (const [name, slug, description] of services) {
    await prisma.service.upsert({
      where: { slug },
      update: { name, description, isActive: true },
      create: { name, slug, description },
    })
  }

  for (const key of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: key.replace(".", " ") },
    })
  }

  for (const roleName of Object.values(UserRoleName)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: roleName.replaceAll("_", " ") },
    })

    const rolePermissions =
      roleName === "CONTENT_MANAGER"
        ? permissions.filter((key) => key.startsWith("cms") || key.startsWith("gallery") || key.startsWith("testimonials"))
        : permissions

    for (const key of rolePermissions) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key } })
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      })
    }
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@taakshvisolutionhub.com" },
    update: { name: "Taakshvi Admin", isActive: true },
    create: {
      name: "Taakshvi Admin",
      email: "admin@taakshvisolutionhub.com",
      passwordHash: await bcrypt.hash("ChangeMe@12345", 12),
    },
  })

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: "SUPER_ADMIN" } })
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: superAdminRole.id },
  })

  for (let index = 0; index < routingRules.length; index += 1) {
    const rule = routingRules[index]
    const service = rule.serviceSlug ? await prisma.service.findUnique({ where: { slug: rule.serviceSlug } }) : null

    await prisma.leadRoutingRule.upsert({
      where: { id: `seed-routing-${index}` },
      update: {
        serviceId: service?.id ?? null,
        city: rule.city ?? null,
        ownerName: rule.reason,
        assignedMobile: rule.mobile,
        assignedWhatsapp: rule.whatsapp ?? rule.mobile,
        assignedEmail: "namaste@taakshvisolutionhub.com",
        priority: index + 1,
        isActive: true,
      },
      create: {
        id: `seed-routing-${index}`,
        serviceId: service?.id ?? null,
        city: rule.city ?? null,
        ownerName: rule.reason,
        assignedMobile: rule.mobile,
        assignedWhatsapp: rule.whatsapp ?? rule.mobile,
        assignedEmail: "namaste@taakshvisolutionhub.com",
        priority: index + 1,
      },
    })
  }

  await prisma.setting.upsert({
    where: { key: "recent_enquiries_widget" },
    update: { value: { enabled: true, limit: 4, liveBadge: true } },
    create: { key: "recent_enquiries_widget", value: { enabled: true, limit: 4, liveBadge: true } },
  })

  await prisma.setting.upsert({
    where: { key: "site_contact" },
    update: { value: { phone: "7977938960", email: "namaste@taakshvisolutionhub.com" } },
    create: { key: "site_contact", value: { phone: "7977938960", email: "namaste@taakshvisolutionhub.com" } },
  })

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        tags: post.tags,
        metaTitle: post.title,
        metaDescription: toMetaDescription(post.shortDescription),
        status: PublishStatus.PUBLISHED,
        publishDate: new Date(post.publishDate),
        authorId: admin.id,
      },
      create: {
        title: post.title,
        slug: post.slug,
        shortDescription: post.shortDescription,
        content: post.content,
        tags: post.tags,
        metaTitle: post.title,
        metaDescription: toMetaDescription(post.shortDescription),
        status: PublishStatus.PUBLISHED,
        publishDate: new Date(post.publishDate),
        authorId: admin.id,
      },
    })
  }

  for (const post of newsPosts) {
    await prisma.newsPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        newsUrl: post.newsUrl,
        sourceName: post.sourceName,
        shortDescription: post.shortDescription,
        content: post.content,
        tags: post.tags,
        metaTitle: post.title,
        metaDescription: toMetaDescription(post.shortDescription),
        status: PublishStatus.PUBLISHED,
        publishDate: new Date(post.publishDate),
        authorId: admin.id,
      },
      create: {
        title: post.title,
        slug: post.slug,
        newsUrl: post.newsUrl,
        sourceName: post.sourceName,
        shortDescription: post.shortDescription,
        content: post.content,
        tags: post.tags,
        metaTitle: post.title,
        metaDescription: toMetaDescription(post.shortDescription),
        status: PublishStatus.PUBLISHED,
        publishDate: new Date(post.publishDate),
        authorId: admin.id,
      },
    })
  }

  for (const item of galleryItems) {
    const service = item.serviceSlug
      ? await prisma.service.findUnique({ where: { slug: item.serviceSlug } })
      : null

    await prisma.galleryItem.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        type: item.type,
        url: item.url,
        category: item.category,
        serviceId: service?.id ?? null,
      },
      create: {
        id: item.id,
        title: item.title,
        type: item.type,
        url: item.url,
        category: item.category,
        serviceId: service?.id ?? null,
      },
    })
  }

  for (const item of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        company: item.company,
        photo: item.photo,
        rating: item.rating,
        review: item.review,
        isActive: true,
      },
      create: item,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
