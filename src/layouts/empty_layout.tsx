import React from "react"

const EmptyLayout: React.FC<any> = ({ children }) => {
    return (
        <div className="flex items-center justify-center" style={{ 
            minWidth: "100vw",
            minHeight: "100vh",
            backgroundImage: "url('./bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
            { children }
        </div>
    )
}

export default EmptyLayout;