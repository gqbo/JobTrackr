"""Dev seed script — NOT imported by the FastAPI app.

Usage:
    SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... SEED_USER_ID=... python seed_dev.py

Or with a .env file in the backend/ directory.
"""

import logging
import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
SEED_USER_ID = os.environ["SEED_USER_ID"]

# Fixed UUIDs for idempotent upserts
APP_IDS = [
    "11111111-0000-0000-0000-000000000001",
    "11111111-0000-0000-0000-000000000002",
    "11111111-0000-0000-0000-000000000003",
    "11111111-0000-0000-0000-000000000004",
    "11111111-0000-0000-0000-000000000005",
    "11111111-0000-0000-0000-000000000006",
    "11111111-0000-0000-0000-000000000007",
    "11111111-0000-0000-0000-000000000008",
    "11111111-0000-0000-0000-000000000009",
    "11111111-0000-0000-0000-000000000010",
    "11111111-0000-0000-0000-000000000011",
    "11111111-0000-0000-0000-000000000012",
    "11111111-0000-0000-0000-000000000013",
    "11111111-0000-0000-0000-000000000014",
    "11111111-0000-0000-0000-000000000015",
]

NOTE_IDS = [
    "22222222-0000-0000-0000-000000000001",
    "22222222-0000-0000-0000-000000000002",
    "22222222-0000-0000-0000-000000000003",
    "22222222-0000-0000-0000-000000000004",
    "22222222-0000-0000-0000-000000000005",
    "22222222-0000-0000-0000-000000000006",
    "22222222-0000-0000-0000-000000000007",
    "22222222-0000-0000-0000-000000000008",
    "22222222-0000-0000-0000-000000000009",
    "22222222-0000-0000-0000-000000000010",
    "22222222-0000-0000-0000-000000000011",
    "22222222-0000-0000-0000-000000000012",
    "22222222-0000-0000-0000-000000000013",
    "22222222-0000-0000-0000-000000000014",
    "22222222-0000-0000-0000-000000000015",
]

APPLICATIONS = [
    {
        "id": APP_IDS[0],
        "user_id": SEED_USER_ID,
        "url": "https://careers.google.com/jobs/senior-frontend",
        "company": "Google",
        "role": "Senior Frontend Engineer",
        "status": "interviewing",
        "modality": "remote",
        "location": None,
        "salary": "$180k–$220k",
        "source": "linkedin",
    },
    {
        "id": APP_IDS[1],
        "user_id": SEED_USER_ID,
        "url": "https://stripe.com/jobs/product-designer",
        "company": "Stripe",
        "role": "Product Designer",
        "status": "applied",
        "modality": "hybrid",
        "location": "New York, NY",
        "salary": None,
        "source": "company",
    },
    {
        "id": APP_IDS[2],
        "user_id": SEED_USER_ID,
        "url": "https://careers.airbnb.com/software-engineer-ii",
        "company": "Airbnb",
        "role": "Software Engineer II",
        "status": "bookmarked",
        "modality": "remote",
        "location": None,
        "salary": "$160k–$190k",
        "source": "linkedin",
    },
    {
        "id": APP_IDS[3],
        "user_id": SEED_USER_ID,
        "url": "https://www.metacareers.com/mobile-engineer-ios",
        "company": "Meta",
        "role": "Mobile Engineer iOS",
        "status": "rejected",
        "modality": "on_site",
        "location": "Menlo Park, CA",
        "salary": None,
        "source": "referral",
    },
    {
        "id": APP_IDS[4],
        "user_id": SEED_USER_ID,
        "url": "https://tradestation.com/careers/intern",
        "company": "TradeStation",
        "role": "Software Engineer Intern",
        "status": "ghosted",
        "modality": "remote",
        "location": None,
        "salary": "$35/hr",
        "source": "linkedin",
    },
    {
        "id": APP_IDS[5],
        "user_id": SEED_USER_ID,
        "url": "https://babel.com/careers/full-stack",
        "company": "Babel",
        "role": "Full Stack .NET/React",
        "status": "applied",
        "modality": "remote",
        "location": None,
        "salary": None,
        "source": "indeed",
    },
    {
        "id": APP_IDS[6],
        "user_id": SEED_USER_ID,
        "url": "https://transunion.com/careers/software-engineer",
        "company": "TransUnion",
        "role": "Software Engineer",
        "status": "bookmarked",
        "modality": "remote",
        "location": None,
        "salary": "$130k–$150k",
        "source": "linkedin",
    },
    {
        "id": APP_IDS[7],
        "user_id": SEED_USER_ID,
        "url": "https://shopify.engineering/frontend-developer",
        "company": "Shopify",
        "role": "Frontend Developer",
        "status": "interviewing",
        "modality": "remote",
        "location": None,
        "salary": None,
        "source": "company",
    },
    {
        "id": APP_IDS[8],
        "user_id": SEED_USER_ID,
        "url": "https://github.com/careers/staff-engineer",
        "company": "GitHub",
        "role": "Staff Engineer",
        "status": "accepted",
        "modality": "remote",
        "location": None,
        "salary": "$230k–$270k",
        "source": "linkedin",
    },
    {
        "id": APP_IDS[9],
        "user_id": SEED_USER_ID,
        "url": "https://jobs.netflix.com/senior-react-developer",
        "company": "Netflix",
        "role": "Senior React Developer",
        "status": "applied",
        "modality": "on_site",
        "location": "Los Gatos, CA",
        "salary": None,
        "source": "linkedin",
    },
    {
        "id": APP_IDS[10],
        "user_id": SEED_USER_ID,
        "url": "https://cloudflare.com/careers/systems-engineer",
        "company": "Cloudflare",
        "role": "Systems Engineer",
        "status": "applied",
        "modality": "remote",
        "location": None,
        "salary": "$155k–$185k",
        "source": "company",
    },
    {
        "id": APP_IDS[11],
        "user_id": SEED_USER_ID,
        "url": "https://vercel.com/careers/dx-engineer",
        "company": "Vercel",
        "role": "DX Engineer",
        "status": "bookmarked",
        "modality": "remote",
        "location": None,
        "salary": None,
        "source": "twitter",
    },
    {
        "id": APP_IDS[12],
        "user_id": SEED_USER_ID,
        "url": "https://linear.app/careers/product-engineer",
        "company": "Linear",
        "role": "Product Engineer",
        "status": "interviewing",
        "modality": "remote",
        "location": None,
        "salary": "$170k–$200k",
        "source": "company",
    },
    {
        "id": APP_IDS[13],
        "user_id": SEED_USER_ID,
        "url": "https://notion.so/careers/software-engineer",
        "company": "Notion",
        "role": "Software Engineer",
        "status": "rejected",
        "modality": "hybrid",
        "location": "San Francisco, CA",
        "salary": None,
        "source": "linkedin",
    },
    {
        "id": APP_IDS[14],
        "user_id": SEED_USER_ID,
        "url": "https://figma.com/careers/frontend-engineer",
        "company": "Figma",
        "role": "Frontend Engineer",
        "status": "applied",
        "modality": "hybrid",
        "location": "San Francisco, CA",
        "salary": "$165k–$195k",
        "source": "referral",
    },
]

NOTES = [
    {
        "id": NOTE_IDS[0],
        "application_id": APP_IDS[0],
        "user_id": SEED_USER_ID,
        "content": "Pasé la primera ronda técnica. Me pidieron un home assignment sobre rendering performance.",
    },
    {
        "id": NOTE_IDS[1],
        "application_id": APP_IDS[0],
        "user_id": SEED_USER_ID,
        "content": "Entregué el home assignment. El equipo es de 8 personas trabajando en Google Maps.",
    },
    {
        "id": NOTE_IDS[2],
        "application_id": APP_IDS[2],
        "user_id": SEED_USER_ID,
        "content": "Rol interesante. El stack es React + TypeScript. Sueldo no publicado pero el rango estimado es bueno.",
    },
    {
        "id": NOTE_IDS[3],
        "application_id": APP_IDS[7],
        "user_id": SEED_USER_ID,
        "content": "Primera entrevista fue una charla cultural con el team lead. Muy buena onda.",
    },
    {
        "id": NOTE_IDS[4],
        "application_id": APP_IDS[7],
        "user_id": SEED_USER_ID,
        "content": "Segunda ronda: pair programming session de 1 hora. Me fue bien con los algoritmos.",
    },
    {
        "id": NOTE_IDS[5],
        "application_id": APP_IDS[8],
        "user_id": SEED_USER_ID,
        "content": "¡Oferta recibida! Base $250k + equity. Firmando el lunes.",
    },
    {
        "id": NOTE_IDS[6],
        "application_id": APP_IDS[12],
        "user_id": SEED_USER_ID,
        "content": "Hablé con el founder. Producto muy sólido, equipo pequeño (~30 personas). Me interesa mucho.",
    },
    {
        "id": NOTE_IDS[7],
        "application_id": APP_IDS[12],
        "user_id": SEED_USER_ID,
        "content": "Take-home de diseño de sistemas: diseñar el modelo de sincronización de Linear. 3 días.",
    },
]


def main() -> None:
    client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    client.table("applications").upsert(APPLICATIONS).execute()
    client.table("application_notes").upsert(NOTES).execute()

    logger.info("Seeded %d applications and %d notes for user %s", len(APPLICATIONS), len(NOTES), SEED_USER_ID)


if __name__ == "__main__":
    main()
