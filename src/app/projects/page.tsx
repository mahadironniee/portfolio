import ProjectsSection from "@/components/projects-section";

export default function ProjectsPage() {
    return (
        <>
            <main className="bg-[#0004D9]">
                {/* We can add a spacer or header here if needed, but for now mirroring the section */}
                <ProjectsSection />
            </main>
        </>
    );
}
