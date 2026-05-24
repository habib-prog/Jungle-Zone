
const AdminSidebarButton = ({ label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition cursor-pointer ${active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}
        >
            {label}
        </button>
    )
}

export default AdminSidebarButton