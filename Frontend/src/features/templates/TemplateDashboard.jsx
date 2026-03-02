import { useState } from "react";
import { useTemplates } from "./hooks/useTemplates";
import TemplateRow from "./components/TemplateRow";
import InlineTemplateRow from "./components/InlineTemplateRow";
import CreateTemplateModal from "./components/CreateTemplateModal";



const TemplateDashboard = () => {
    const {
        templates,
        isLoading,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        cloneTemplate,
    } = useTemplates();

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("modified");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isAddingInline, setIsAddingInline] = useState(false);


    const filteredTemplates = templates.filter(
        (t) =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.subject.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const sortedTemplates = [...filteredTemplates].sort((a, b) => {
        if (sortBy === "name") {
            return a.name.localeCompare(b.name);
        }
        return (
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );
    });

    const handleCreateTemplate = async (formData) => {
        try {
            await createTemplate(formData);
            setIsAddingInline(false);
        } catch (err) {
            console.error(
                "[TemplateDashboard] Failed to create template:",
                err,
            );
        }
        setShowCreateModal(false);
    };

    const handleDeleteTemplate = async (id) => {
        try {
            await deleteTemplate(id);
        } catch (err) {
            console.error(
                "[TemplateDashboard] Failed to delete template:",
                err,
            );
        }
    };

    return (
        <main className="flex-1 flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden w-full">
            {/* Header */}
            <header className="h-14 px-8 bg-white/70 dark:bg-surface-dark/70 backdrop-blur-md border-b border-border-light dark:border-border-dark flex items-center justify-between shrink-0 sticky top-0 z-50">
                <div className="flex items-center gap-1">
                    <img
                        src="/bp-square_Logo.png"
                        alt="Processium Logo"
                        className="w-10 h-10 rounded-lg object-contain"
                    />
                    <h1 className="text-lg font-bold tracking-tight text-text-main dark:text-white flex items-center gap-2">
                        Processium{" "}
                        <span className="text-text-muted font-normal mx-1">
                            /
                        </span>{" "}
                        <span className="text-primary/90 font-semibold">
                            Templates
                        </span>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <nav className="hidden lg:flex items-center gap-6">
                        <a
                            className="text-xs font-semibold text-primary border-b-2 border-primary h-14 flex items-center"
                            href="#"
                        >
                            Templates
                        </a>

                        <a
                            className="text-xs font-medium text-text-muted hover:text-text-main transition-colors h-14 flex items-center"
                            href="#"
                        >
                            Instances
                        </a>
                    </nav>

                    <div className="h-6 w-px bg-border-light dark:bg-border-dark hidden md:block"></div>

                    <div className="relative w-64 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                            <span className="material-symbols-outlined text-text-muted text-[18px]">
                                search
                            </span>
                        </div>
                        <input
                            className="block w-full pl-9 pr-3 py-1.5 border border-border-light dark:border-border-dark rounded-full bg-background-light/30 dark:bg-background-dark/30 text-text-main dark:text-gray-200 placeholder-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-xs transition-all duration-200"
                            placeholder="Search..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-all relative group">
                            <span className="material-symbols-outlined text-[20px]">
                                notifications
                            </span>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark group-hover:scale-110 transition-transform"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all shadow-sm">
                            JD
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 p-4 overflow-y-auto max-w-[1600px] mx-auto w-full">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <button className="px-3.5 py-1.5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-xs font-semibold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 shadow-sm transition-all hover:border-primary/30">
                            <span className="material-symbols-outlined text-[16px] text-text-muted">
                                filter_list
                            </span>
                            Filter
                        </button>
                        <button
                            onClick={() =>
                                setSortBy(
                                    sortBy === "modified"
                                        ? "name"
                                        : "modified",
                                )
                            }
                            className="px-3.5 py-1.5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-xs font-semibold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 shadow-sm transition-all hover:border-primary/30"
                        >
                            <span className="material-symbols-outlined text-[16px] text-text-muted">
                                sort
                            </span>
                            {sortBy === "modified"
                                ? "Recently Modified"
                                : "By Name"}
                        </button>
                    </div>
                    <button
                        onClick={() => setIsAddingInline(true)}
                        className="bg-primary text-primary-content px-4 py-1.5 rounded-lg flex items-center gap-2 shadow-md shadow-primary/20 hover:bg-blue-600 transition-all text-xs font-bold hover:shadow-lg active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            add
                        </span>
                        New Template
                    </button>
                </div>

                {/* Templates Table */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-card border border-border-light dark:border-border-dark overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-2 bg-gray-50/50 dark:bg-gray-800/50 border-b border-border-light dark:border-border-dark text-[9px] font-bold text-text-muted uppercase tracking-widest">
                        <div className="col-span-4 flex items-center pl-1">
                            Title
                        </div>
                        <div className="col-span-6 flex items-center">
                            Description
                        </div>
                        <div className="col-span-2 text-right pr-1">
                            Actions
                        </div>
                    </div>

                    <div className="divide-y divide-border-light dark:divide-border-dark">
                        {sortedTemplates.map((template) => (
                            <TemplateRow
                                key={template.id}
                                template={template}
                                onUpdate={updateTemplate}
                                onDelete={handleDeleteTemplate}
                                onClone={cloneTemplate}
                                isLoading={isLoading}
                            />


                        ))}

                        {isAddingInline && (
                            <InlineTemplateRow
                                onSave={handleCreateTemplate}
                                onCancel={() => setIsAddingInline(false)}
                            />
                        )}
                    </div>

                    {sortedTemplates.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <p className="text-text-muted">
                                No templates found
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Template Modal */}
            {showCreateModal && (
                <CreateTemplateModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateTemplate}
                />
            )}
        </main>
    );
};

export default TemplateDashboard;
