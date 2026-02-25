import Image from "next/image";

export default function ClaritySticker({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Image
                src="/clarity.svg"
                alt="with Clarity"
                width={352}
                height={113}
                className="w-full h-auto"
            />
        </div>
    );
}
