import { useState } from 'react'
import JsonForm from './components/JsonForm';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { SelectedQuestProvider } from './contexts/SelectedQuestContext';
import { QuestDataProvider } from './contexts/QuestDataContext';

import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
import './style.css';
import 'primeicons/primeicons.css';
import QuestListView from './components/QuestListView';
import QuestEditorView from './components/QuestEditorView';
import QuestEditorHeader from './components/QuestEditorHeader';

interface JsonData {
  name: string;
  age: number;
  city: string;
}

const App: React.FC = () => {
  const [jsonData, setJsonData] = useState<JsonData>({
    name: "John Doe",
    age: 30,
    city: "New York"
  });

  const handleFormSubmit = (data: JsonData) => {
    setJsonData(data);
    console.log("Updated JSON Data:", data);
  };

  return (
    <main style={{ paddingLeft: '15%', paddingRight: '15%', height: '1000px' }}>
      <QuestDataProvider>
        <SelectedQuestProvider>
          <QuestEditorHeader />
          <Splitter style={{ height: '100%' }}>
            <SplitterPanel className="flex align-items-center justify-content-center" style={{maxWidth: '30%'}}>
              <QuestListView/>
            </SplitterPanel>
            <SplitterPanel className="flex align-items-center justify-content-center">
              <QuestEditorView />
            </SplitterPanel>
          </Splitter>
        </SelectedQuestProvider>
      </QuestDataProvider>
    </main>
  );
};

export default App;
