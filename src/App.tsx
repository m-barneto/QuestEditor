import { Splitter, SplitterPanel } from 'primereact/splitter';
import { SelectedQuestProvider } from './contexts/SelectedQuestContext';
import { QuestDataProvider } from './contexts/QuestDataContext';

import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
import './style.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css'
import QuestListView from './components/QuestListView';
import QuestEditorView from './components/QuestEditorView';
import QuestEditorHeader from './components/QuestEditorHeader';
import { QuestListboxProvider } from './contexts/QuestListboxContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { UserLayoutProvider } from './contexts/UserLayoutContext';
import { useState } from 'react';


const App: React.FC = () => {
    const [ height ] = useState<string>(`${screen.availHeight * 0.83}px`)
    return (
        <main style={{ paddingLeft: '15%', paddingRight: '15%', height: height }}>
            <UserLayoutProvider>
                <QuestDataProvider>
                    <LocaleProvider>
                        <SelectedQuestProvider>
                            <QuestListboxProvider>
                                <QuestEditorHeader />
                                <Splitter style={{ height: '100%' }}>
                                    <SplitterPanel className="flex flex-row" style={{maxWidth: '30%', width: "200px"}}>
                                        <QuestListView/>
                                    </SplitterPanel>
                                    <SplitterPanel>
                                        <QuestEditorView />
                                    </SplitterPanel>
                                </Splitter>
                            </QuestListboxProvider>
                        </SelectedQuestProvider>
                    </LocaleProvider>
                </QuestDataProvider>
            </UserLayoutProvider>
        </main>
    );
};

export default App;
