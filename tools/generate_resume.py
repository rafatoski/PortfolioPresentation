from pathlib import Path
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Rafael-Castillo-CV.pdf"
PUBLIC_COPY = ROOT / "public" / "Rafael-Castillo-CV.pdf"

PAGE_WIDTH, PAGE_HEIGHT = A4
NAVY = colors.HexColor("#0B1020")
INK = colors.HexColor("#182033")
MUTED = colors.HexColor("#526078")
ACCENT = colors.HexColor("#00A86B")
VIOLET = colors.HexColor("#7956D8")
LINE = colors.HexColor("#DCE2EA")
PAPER = colors.HexColor("#FFFFFF")


def on_page(canvas, doc):
    canvas.saveState()
    if doc.page == 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, PAGE_HEIGHT - 59 * mm, PAGE_WIDTH, 59 * mm, fill=1, stroke=0)
        canvas.setFillColor(ACCENT)
        canvas.rect(0, PAGE_HEIGHT - 61 * mm, PAGE_WIDTH, 2 * mm, fill=1, stroke=0)
        canvas.setFillColor(PAPER)
        canvas.setFont("Helvetica-Bold", 27)
        canvas.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 25 * mm, "RAFAEL CASTILLO")
        canvas.setFillColor(colors.HexColor("#B8F5DA"))
        canvas.setFont("Helvetica", 11.5)
        canvas.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 35 * mm, "AI ENGINEERING MANAGER  |  AI PRODUCT ENGINEER")
        canvas.setFillColor(colors.HexColor("#D8DEEA"))
        canvas.setFont("Helvetica", 7.7)
        canvas.drawCentredString(
            PAGE_WIDTH / 2,
            PAGE_HEIGHT - 46 * mm,
            "rafaelcastilloac89@gmail.com  |  linkedin.com/in/rafaelcastillocreative  |  github.com/rafatoski",
        )
    else:
        canvas.setFillColor(NAVY)
        canvas.rect(0, PAGE_HEIGHT - 17 * mm, PAGE_WIDTH, 17 * mm, fill=1, stroke=0)
        canvas.setFillColor(ACCENT)
        canvas.rect(0, PAGE_HEIGHT - 18 * mm, PAGE_WIDTH, 1 * mm, fill=1, stroke=0)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColor(PAPER)
        canvas.drawString(18 * mm, PAGE_HEIGHT - 11 * mm, "RAFAEL CASTILLO")
        canvas.setFont("Helvetica", 8)
        canvas.drawRightString(PAGE_WIDTH - 18 * mm, PAGE_HEIGHT - 11 * mm, "AI ENGINEERING MANAGER")

    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 13 * mm, PAGE_WIDTH - 18 * mm, 13 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 8.5 * mm, "rafatoski.github.io/PortfolioPresentation")
    canvas.drawRightString(PAGE_WIDTH - 18 * mm, 8.5 * mm, f"Page {doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="Name",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=27,
    leading=30,
    textColor=PAPER,
    alignment=TA_CENTER,
    spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="ResumeTitle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=12,
    leading=15,
    textColor=colors.HexColor("#B8F5DA"),
    alignment=TA_CENTER,
    spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="Contact",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.3,
    leading=12,
    textColor=colors.HexColor("#D8DEEA"),
    alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name="Section",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=10.5,
    leading=13,
    textColor=VIOLET,
    spaceBefore=10,
    spaceAfter=5,
    textTransform="uppercase",
))
styles.add(ParagraphStyle(
    name="BodyResume",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=8.7,
    leading=12.4,
    textColor=INK,
    spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="Role",
    parent=styles["BodyText"],
    fontName="Helvetica-Bold",
    fontSize=9.5,
    leading=12,
    textColor=NAVY,
    spaceAfter=1,
))
styles.add(ParagraphStyle(
    name="Meta",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=8.2,
    leading=11,
    textColor=MUTED,
    spaceAfter=3,
))
styles.add(ParagraphStyle(
    name="BulletResume",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=8.5,
    leading=11.6,
    textColor=INK,
    leftIndent=10,
    firstLineIndent=-6,
    bulletIndent=2,
    spaceAfter=2.2,
))
styles.add(ParagraphStyle(
    name="Skills",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=8.4,
    leading=12,
    textColor=INK,
    spaceAfter=3,
))


def section(title):
    return [
        Paragraph(title.upper(), styles["Section"]),
        HRFlowable(width="100%", thickness=0.7, color=LINE, spaceAfter=5),
    ]


def bullet(text):
    return Paragraph(text, styles["BulletResume"], bulletText="•")


def role(title, company, dates, bullets=None):
    items = [
        Paragraph(title, styles["Role"]),
        Paragraph(f"{company}  |  {dates}", styles["Meta"]),
    ]
    for text in bullets or []:
        items.append(bullet(text))
    items.append(Spacer(1, 3))
    return [KeepTogether(items)]


def build_resume():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="Rafael Castillo - AI Engineering Manager Resume",
        author="Rafael Castillo",
        subject="Professional resume",
    )
    first_frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        PAGE_HEIGHT - doc.bottomMargin - 64 * mm,
        id="first",
        topPadding=4 * mm,
        bottomPadding=0,
        leftPadding=0,
        rightPadding=0,
    )
    later_frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        PAGE_HEIGHT - doc.bottomMargin - 21 * mm,
        id="later",
        topPadding=3 * mm,
        bottomPadding=0,
        leftPadding=0,
        rightPadding=0,
    )
    doc.addPageTemplates([
        PageTemplate(id="first", frames=[first_frame], onPage=on_page, autoNextPageTemplate="later"),
        PageTemplate(id="later", frames=[later_frame], onPage=on_page),
    ])

    story = [Spacer(1, 3 * mm)]

    story += section("Professional Summary")
    story.append(Paragraph(
        "AI Engineering Manager and product-minded software professional with a background spanning AI engineering, full-stack development, UX/UI, and product design. Leads AI engineering teams and connects technical strategy with practical delivery across intelligent products, agentic workflows, business automation, API integrations, and human-centered interfaces.",
        styles["BodyResume"],
    ))

    story += section("Core Skills")
    skill_rows = [
        ("AI & Automation", "OpenAI API, AI agents, agentic workflows, n8n, webhooks, workflow automation"),
        ("Engineering", "JavaScript, TypeScript, React, Vue, HTML, CSS, PHP, REST APIs, authentication, databases"),
        ("Product & Design", "Product strategy, UX/UI design, prototyping, design systems, accessibility, Figma"),
        ("Leadership & Delivery", "Team leadership, technical strategy, cross-functional collaboration, deployment workflows, GitHub Actions"),
    ]
    for label, content in skill_rows:
        story.append(Paragraph(f"<b>{label}:</b> {content}", styles["Skills"]))

    story += section("Professional Experience")
    story += role(
        "AI Engineering Manager",
        "Xperience Marketing Solutions (XMS)",
        "2025 - Present",
        [
            "Manage and lead the AI engineering team, guiding technical strategy, collaboration, and product delivery.",
            "Design and build applied AI products, agentic workflows, business automations, and internal tools.",
            "Connect AI services with APIs, authentication, databases, webhooks, CRM workflows, and deployment pipelines.",
            "Apply product design and full-stack engineering to create reliable, usable, human-centered AI systems.",
        ],
    )
    story += role(
        "Design & Engineering Manager / Product Designer / Full-Stack Developer",
        "Alaska Tech",
        "2024 - 2025",
        [
            "Led cross-functional design and engineering teams, coordinating product strategy and delivery.",
            "Connected product design decisions with frontend and full-stack implementation across digital products.",
            "Supported scalable user experiences through prototyping, interface design, development, and technical collaboration.",
        ],
    )
    story += role(
        "UX/UI Front-End Developer",
        "Sell2Rent",
        "2023 - 2024",
        [
            "Designed and implemented responsive product interfaces in collaboration with a remote, cross-functional team.",
            "Translated UX/UI requirements into production-ready frontend experiences for a real-estate technology product.",
        ],
    )
    story += role(
        "Senior UX/UI Designer",
        "Indeed.com",
        "2022 - 2023",
        [
            "Contributed senior UX/UI expertise to product experiences, balancing user needs, visual clarity, and implementation considerations.",
        ],
    )
    story += role(
        "Designer / Front-End Developer",
        "BingeWave",
        "2021 - 2022",
        [
            "Translated product vision into responsive interfaces and frontend implementations for a digital video platform.",
            "Collaborated directly with product leadership and developers to improve visual quality and performance.",
        ],
    )
    story += role(
        "Senior Graphic Web Designer",
        "Web4Realty",
        "2018 - 2021",
        [
            "Delivered web and visual design work for real-estate products while contributing to team culture and client-facing quality.",
        ],
    )
    story += role("Web Designer", "ZNetworks Group", "2015 - 2017")
    story += role("Digital Graphic Designer", "eSmart Digital", "2014 - 2015")

    story += section("Selected Projects")
    projects = [
        ("Dress in Person", "Mobile-first browser dress-up game; product design and frontend development."),
        ("Draft Animal Arena", "Responsive 3v3 browser auto-battler; game interface and web implementation."),
        ("TravelKit", "Product design, UX/UI, and frontend development for a travel technology platform."),
        ("Heraldos del Evangelio", "Design, development, and digital marketing strategy."),
    ]
    for name, description in projects:
        story.append(Paragraph(f"<b>{name}:</b> {description}", styles["Skills"]))

    story += section("Education")
    education = [
        ("Full-Stack Development", "Enyoi Online School"),
        ("Audiovisual & Multimedia Production", "Jorge Tadeo Lozano University"),
        ("Multimedia Production", "SENA Colombia"),
    ]
    for program, institution in education:
        story.append(Paragraph(f"<b>{program}</b>  |  {institution}", styles["Skills"]))

    story += section("Professional Focus")
    story.append(Paragraph(
        "Applied AI systems, AI-powered web products, intelligent lead generation, client onboarding, CRM integrations, workflow architecture, product strategy, and scalable user experiences.",
        styles["BodyResume"],
    ))

    doc.build(story)
    shutil.copy2(OUTPUT, PUBLIC_COPY)
    print(f"Created {OUTPUT}")
    print(f"Published copy {PUBLIC_COPY}")


if __name__ == "__main__":
    build_resume()
