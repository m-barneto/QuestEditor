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


const App: React.FC = () => {
    return (
        <main style={{ paddingLeft: '15%', paddingRight: '15%', height: '1000px' }}>
            <QuestDataProvider>
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
            </QuestDataProvider>
        </main>
    );
};

export default App;
