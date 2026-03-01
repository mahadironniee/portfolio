"use client";

export default function BurgerMenu({ className }: { className?: string }) {
    return (
        <div className={`burger-icon ${className || ""}`}>
            <span className="burger-left" />
            <span className="burger-right" />
        </div>
    );
}
