import { PrismaClient } from "@prisma/client"
import crypto from "node:crypto"

const prisma = new PrismaClient()

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3001"

const callbackCases = [
  {
    service: "corporate-events",
    city: "Mumbai",
    expectedWhatsapp: "7977938960",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Event Type": "Annual Conference",
      "Event Date": "2026-07-18",
      "Event Location": "BKC",
      "Number of Guests": "180",
      "Budget Range": "15L-20L",
      "Requirement Details": "Need stage, registrations, AV, and guest hospitality.",
    },
  },
  {
    service: "tours-travel",
    city: "Pune",
    expectedWhatsapp: "8460623469",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      Destination: "Bali",
      "Travel Dates": "2026-08-02 to 2026-08-07",
      "Number of Travellers": "6",
      "Budget Range": "4L-5L",
      "Requirement Details": "Luxury villa and local transport required.",
    },
  },
  {
    service: "wellness-retreats",
    city: "Nasik",
    expectedWhatsapp: "7977938960",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Preferred Location": "Lonavala",
      "Preferred Dates": "2026-09-12 to 2026-09-15",
      "Number of Participants": "24",
      "Requirement Details": "Need yoga, nutrition, and nature-based itinerary.",
    },
  },
  {
    service: "branding-marketing",
    city: "Mumbai",
    expectedWhatsapp: "7977938960",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Business Name": "Taakshvi QA Brand",
      "Services Required": "Brand refresh and launch campaign",
      "Project Budget": "8L",
      "Requirement Details": "Need new deck, social launch, and landing page copy.",
    },
  },
  {
    service: "photography-videography",
    city: "Surat",
    expectedWhatsapp: "7977938960",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Shoot Type": "Corporate event",
      "Event Date": "2026-07-28",
      Location: "Surat",
      "Requirement Details": "Need photo, highlight reel, and speaker bites.",
    },
  },
  {
    service: "artist-management",
    city: "Mumbai",
    expectedWhatsapp: "7977938960",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Artist Category": "Stand-up comic",
      "Event Date": "2026-08-15",
      "Event Location": "Mumbai",
      "Budget Range": "3L",
      "Requirement Details": "Need 45-minute performance for client evening.",
    },
  },
  {
    service: "venue-sourcing",
    city: "Ahmedabad",
    expectedWhatsapp: "7977938960",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      City: "Ahmedabad",
      "Event Date": "2026-09-02",
      "Number of Guests": "120",
      "Budget Range": "6L",
      "Requirement Details": "Indoor venue with parking and stage setup.",
    },
  },
  {
    service: "team-building-activities",
    city: "Mumbai",
    expectedWhatsapp: "7977938960",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Team Size": "75",
      "Preferred Date": "2026-08-08",
      "Preferred Location": "Karjat",
      Objective: "Cross-functional trust building",
      "Requirement Details": "Need one-day offsite with facilitation.",
    },
  },
  {
    service: "real-estate",
    city: "Ahmedabad",
    expectedWhatsapp: "8460623469",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Buy / Sell / Rent / Lease": "Buy",
      "Property Type": "Office",
      "Preferred Location": "SG Highway",
      "Budget Range": "2Cr",
      "Requirement Details": "Need furnished office in commercial zone.",
    },
  },
  {
    service: "astrology",
    city: "Mumbai",
    expectedWhatsapp: "9833031572",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Consultation Type": "Career guidance",
      "Preferred Consultation Mode": "Video",
      "Date Of Birth": "1992-03-11",
      "Requirement Details": "Need detailed consultation with remedies.",
    },
  },
  {
    service: "finance",
    city: "Pune",
    expectedWhatsapp: "9326277096",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Financial Requirement Type": "Investment planning",
      "Investment Range": "25L",
      "Preferred Consultation Mode": "Phone",
      "Requirement Details": "Need tax-efficient medium-term allocation advice.",
    },
  },
  {
    service: "health-wellness",
    city: "Ahmedabad",
    expectedWhatsapp: "8460623469",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Wellness Service Type": "Therapeutic retreat",
      "Preferred Location": "Udaipur",
      "Preferred Date": "2026-10-04",
      "Requirement Details": "Need senior-friendly plan with comfortable stay.",
    },
  },
  {
    service: "other",
    city: "Mumbai",
    expectedWhatsapp: "7977938960",
    expectedEmail: "namaste@taakshvisolutionhub.com",
    servicePayload: {
      "Service Required": "Custom concierge support",
      "Requirement Details": "Need multi-service coordination for VIP guests.",
    },
  },
]

const whatsappCases = [
  ["corporate-events", "Mumbai", "7977938960"],
  ["tours-travel", "Pune", "8460623469"],
  ["real-estate", "Ahmedabad", "8460623469"],
  ["real-estate", "Mumbai", "7977938960"],
  ["astrology", "Mumbai", "9833031572"],
  ["finance", "Pune", "9326277096"],
  ["health-wellness", "Ahmedabad", "8460623469"],
]

const invalidCases = [
  {
    name: "missing-name",
    payload: {
      fullName: "",
      mobile: "9999999999",
      email: "qa+missing-name@taakshvi.test",
      city: "Mumbai",
      service: "corporate-events",
      message: "Missing name should fail.",
      consentAccepted: "on",
      submissionType: "callback",
      servicePayload: {},
    },
    expectedStatus: 400,
  },
  {
    name: "invalid-email",
    payload: {
      fullName: "QA Invalid Email",
      mobile: "9999999999",
      email: "bad-email",
      city: "Mumbai",
      service: "corporate-events",
      message: "Invalid email should fail.",
      consentAccepted: "on",
      submissionType: "callback",
      servicePayload: {},
    },
    expectedStatus: 400,
  },
  {
    name: "oversize-message",
    payload: {
      fullName: "QA Oversize Message",
      mobile: "9999999999",
      email: "qa+oversize@taakshvi.test",
      city: "Mumbai",
      service: "corporate-events",
      message: "X".repeat(2105),
      consentAccepted: "on",
      submissionType: "callback",
      servicePayload: {},
    },
    expectedStatus: 400,
  },
]

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function postEnquiry(payload) {
  const response = await fetch(`${baseUrl}/api/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const json = await response.json()
  return { status: response.status, json }
}

function buildPayload(serviceCase, submissionType, index) {
  const requestId = crypto.randomUUID()
  return {
    requestId,
    fullName: `QA ${serviceCase.service} ${submissionType}`,
    mobile: `90000${String(index).padStart(5, "0")}`,
    whatsapp: `90000${String(index).padStart(5, "0")}`,
    email: `qa+${serviceCase.service}-${submissionType}-${index}@taakshvi.test`,
    company: "Taakshvi QA",
    city: serviceCase.city,
    service: serviceCase.service,
    message: `QA ${submissionType} flow for ${serviceCase.service} from ${serviceCase.city}. Includes SQL probe ' OR 1=1 -- and <script>alert(1)</script>.`,
    submissionType,
    consentAccepted: "on",
    servicePayload: serviceCase.servicePayload,
  }
}

function extractWaNumber(url) {
  const matched = url.match(/wa\.me\/(\d+)/)
  return matched ? matched[1] : null
}

async function verifyLeadRecord(requestId, expected) {
  const lead = await prisma.lead.findUnique({
    where: { requestId },
    include: {
      service: true,
      assignments: true,
      activities: true,
      followups: true,
    },
  })

  assert(lead, `Lead not found for ${requestId}`)
  assert(lead.status === "NEW", `Expected NEW status for ${requestId}, got ${lead.status}`)
  assert(lead.source === "Website", `Expected source Website for ${requestId}, got ${lead.source}`)
  assert(lead.service.slug === expected.service, `Expected service ${expected.service} for ${requestId}, got ${lead.service.slug}`)
  assert(lead.assignedMobile === expected.expectedWhatsapp, `Expected assigned mobile ${expected.expectedWhatsapp} for ${requestId}, got ${lead.assignedMobile}`)
  assert(lead.assignedEmail === expected.expectedEmail, `Expected assigned email ${expected.expectedEmail} for ${requestId}, got ${lead.assignedEmail}`)
  assert(Object.keys(lead.servicePayload || {}).length === Object.keys(expected.servicePayload).length, `Expected servicePayload keys for ${requestId}`)
  assert(lead.assignments.length >= 1, `Expected assignment for ${requestId}`)
  assert(lead.activities.some((activity) => activity.type === "LEAD_CREATED"), `Expected LEAD_CREATED activity for ${requestId}`)

  return {
    leadId: lead.id,
    assignedMobile: lead.assignedMobile,
    assignedEmail: lead.assignedEmail,
    activityCount: lead.activities.length,
    followupCount: lead.followups.length,
  }
}

async function main() {
  const summary = {
    baseUrl,
    callbackResults: [],
    whatsappResults: [],
    invalidResults: [],
    failures: [],
    services: [],
    routingRules: [],
  }

  const services = await prisma.service.findMany({
    orderBy: { slug: "asc" },
    select: {
      slug: true,
      serviceEmail: true,
      serviceWhatsappNumber: true,
      isActive: true,
    },
  })
  summary.services = services

  const routingRules = await prisma.leadRoutingRule.findMany({
    orderBy: { priority: "asc" },
    select: {
      city: true,
      ownerName: true,
      assignedMobile: true,
      assignedWhatsapp: true,
      assignedEmail: true,
      priority: true,
      service: { select: { slug: true } },
    },
  })
  summary.routingRules = routingRules

  for (const [index, serviceCase] of callbackCases.entries()) {
    try {
      const payload = buildPayload(serviceCase, "callback", index + 1)
      const result = await postEnquiry(payload)
      assert(result.status === 200, `Callback ${serviceCase.service} returned ${result.status}`)
      assert(result.json.ok === true, `Callback ${serviceCase.service} did not return ok=true`)
      assert(result.json.requestId === payload.requestId, `Callback ${serviceCase.service} requestId mismatch`)
      const db = await verifyLeadRecord(payload.requestId, serviceCase)

      summary.callbackResults.push({
        service: serviceCase.service,
        requestId: payload.requestId,
        status: result.status,
        response: result.json,
        db,
      })
    } catch (error) {
      summary.failures.push({
        area: "callback",
        service: serviceCase.service,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const [index, row] of whatsappCases.entries()) {
    const [service, city, expectedWhatsapp] = row
    const serviceCase = callbackCases.find((item) => item.service === service && item.city === city) || callbackCases.find((item) => item.service === service)
    if (!serviceCase) continue

    try {
      const payload = buildPayload({ ...serviceCase, city, expectedWhatsapp }, "whatsapp", index + 100)
      const result = await postEnquiry(payload)
      assert(result.status === 200, `WhatsApp ${service}/${city} returned ${result.status}`)
      assert(result.json.ok === true, `WhatsApp ${service}/${city} did not return ok=true`)
      assert(result.json.submissionType === "whatsapp", `WhatsApp ${service}/${city} submissionType mismatch`)
      assert(typeof result.json.redirectUrl === "string", `WhatsApp ${service}/${city} missing redirectUrl`)
      const redirectNumber = extractWaNumber(result.json.redirectUrl)
      assert(redirectNumber === expectedWhatsapp || redirectNumber === `91${expectedWhatsapp}`, `WhatsApp ${service}/${city} routed to ${redirectNumber}, expected ${expectedWhatsapp}`)
      assert(result.json.redirectUrl.includes(encodeURIComponent("Please contact me.")), `WhatsApp ${service}/${city} message missing CTA line`)

      const db = await verifyLeadRecord(payload.requestId, {
        ...serviceCase,
        city,
        expectedWhatsapp,
      })

      summary.whatsappResults.push({
        service,
        city,
        requestId: payload.requestId,
        redirectUrl: result.json.redirectUrl,
        response: result.json,
        db,
      })
    } catch (error) {
      summary.failures.push({
        area: "whatsapp",
        service: `${service}/${city}`,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const invalidCase of invalidCases) {
    try {
      const result = await postEnquiry({
        requestId: crypto.randomUUID(),
        ...invalidCase.payload,
      })
      assert(result.status === invalidCase.expectedStatus, `Invalid case ${invalidCase.name} returned ${result.status}`)
      assert(result.json.ok === false, `Invalid case ${invalidCase.name} unexpectedly succeeded`)
      summary.invalidResults.push({
        name: invalidCase.name,
        status: result.status,
        response: result.json,
      })
    } catch (error) {
      summary.failures.push({
        area: "validation",
        service: invalidCase.name,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  console.log(JSON.stringify(summary, null, 2))

  if (summary.failures.length > 0) {
    process.exitCode = 1
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
