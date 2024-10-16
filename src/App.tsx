import { Splitter, SplitterPanel } from "primereact/splitter";
import { SelectedQuestProvider } from "./contexts/SelectedQuestContext";
import { QuestDataProvider } from "./contexts/QuestDataContext";

import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "./style.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import QuestListView from "./components/QuestListView";
import QuestEditorView from "./components/QuestEditorView";
import QuestEditorHeader from "./components/QuestEditorHeader";
import { QuestListboxProvider } from "./contexts/QuestListboxContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { UserLayoutProvider } from "./contexts/UserLayoutContext";
import { useState } from "react";
import { TraderProvider } from "./contexts/TraderContext";
import { ItemsProvider } from "./contexts/ItemsContext";

const App: React.FC = () => {
    return (
        <main>
            <UserLayoutProvider>
                <QuestDataProvider>
                    <LocaleProvider>
                        <TraderProvider>
                            <ItemsProvider>
                                <SelectedQuestProvider>
                                    <QuestListboxProvider>
                                        <QuestEditorHeader />
                                        <Splitter>
                                            <SplitterPanel className="flex flex-row" size={15}>
                                                <QuestListView />
                                            </SplitterPanel>
                                            <SplitterPanel minSize={60}>
                                                <QuestEditorView />
                                            </SplitterPanel>
                                        </Splitter>
                                    </QuestListboxProvider>
                                </SelectedQuestProvider>
                            </ItemsProvider>
                        </TraderProvider>
                    </LocaleProvider>
                </QuestDataProvider>
            </UserLayoutProvider>
        </main>
    );
};

export default App;
