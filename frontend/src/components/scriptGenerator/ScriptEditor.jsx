import React, { useEffect, useState, useRef } from 'react';
import { Editor, EditorState, RichUtils, ContentState, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { stateFromHTML } from 'draft-js-import-html';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import html2pdf from 'html2pdf.js';

// Import split components
import { EditorContainer, EditorWrapper } from './EditorComponents';
import EditorToolbar from './EditorToolbar';
import EditorControls from './EditorControls';
import { getSelectedText, generateExportHTML } from './EditorUtils';

const ScriptEditor = ({ initialContent, onSave }) => {
  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      // Check if content is markdown
      if (initialContent.startsWith('#') || initialContent.includes('##')) {
        return EditorState.createWithContent(stateFromMarkdown(initialContent));
      }
      // Check if content is HTML
      else if (initialContent.includes('<')) {
        return EditorState.createWithContent(stateFromHTML(initialContent));
      }
      // Otherwise treat as plain text
      else {
        return EditorState.createWithContent(ContentState.createFromText(initialContent));
      }
    }
    return EditorState.createEmpty();
  });

  const [fontSize, setFontSize] = useState(16);
  const [hasSelection, setHasSelection] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const editor = useRef(null);

  // Check if undo/redo is available using Draft.js built-in methods
  const canUndo = editorState.getUndoStack().size > 0;
  const canRedo = editorState.getRedoStack().size > 0;

  useEffect(() => {
    // Check if there's a selection and count words
    const selection = editorState.getSelection();
    const isCollapsed = selection.isCollapsed();
    setHasSelection(!isCollapsed);
    
    if (!isCollapsed) {
      const selectedText = getSelectedText(editorState);
      const words = selectedText.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [editorState]);

  const focusEditor = () => {
    if (editor.current) {
      editor.current.focus();
    }
  };

  const handleKeyCommand = (command, editorState) => {
    // Handle standard rich text commands
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    // Custom key command handling for undo/redo would be handled by Draft.js internally
    return 'not-handled';
  };

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleParaphrasing = () => {
    // In a real app, this would call an API
    // For now, we'll just simulate a response
    // alert('Paraphrasing feature would call an API in a production environment');
    
    // Simulating a paraphrased response
    setTimeout(() => {
      const currentText = editorState.getCurrentContent().getPlainText();
      const paraphrasedText = `I've paraphrased: ${currentText.substring(0, 50)}...`;
      
      // Create new content state with paraphrased text
      const newContentState = ContentState.createFromText(paraphrasedText);
      setEditorState(EditorState.createWithContent(newContentState));
    }, 1000);
  };

  const handleExport = async () => {
    const htmlString = generateExportHTML(editorState, fontSize);

    await html2pdf().set({
      margin: 10,
      filename: 'script.pdf',
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(htmlString).save();    
  };

  // Helper function to replace selected text
  const replaceSelectedText = (newText) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    
    const newContentState = Modifier.replaceText(
      contentState,
      selection,
      newText
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-characters'
    );
    
    // Move cursor to end of inserted text
    const newSelection = newEditorState.getSelection().merge({
      anchorOffset: selection.getStartOffset() + newText.length,
      focusOffset: selection.getStartOffset() + newText.length,
    });
    
    const finalEditorState = EditorState.forceSelection(newEditorState, newSelection);
    setEditorState(finalEditorState);
  };

  const handleMakeShorter = async () => {
    if (!hasSelection || wordCount < 3) return;
    
    const selectedText = getSelectedText(editorState);
    setIsProcessing(true);
    setProcessingType('shorter');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Make text shorter - keep approximately half the words, but more intelligently
      const sentences = selectedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
      let shortenedText;
      
      if (sentences.length > 1) {
        // Keep first sentence and make it more concise
        const firstSentence = sentences[0].trim();
        const words = firstSentence.split(/\s+/);
        shortenedText = words.slice(0, Math.max(5, Math.floor(words.length * 0.7))).join(' ') + '.';
      } else {
        // Single sentence - reduce word count
        const words = selectedText.trim().split(/\s+/);
        shortenedText = words.slice(0, Math.max(3, Math.floor(words.length * 0.6))).join(' ') + '...';
      }
      
      replaceSelectedText(shortenedText);
    } catch (error) {
      console.error('Make shorter failed:', error);
      alert('Failed to make text shorter. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingType('');
    }
  };

  const handleMakeLonger = async () => {
    if (!hasSelection) return;
    
    const selectedText = getSelectedText(editorState);
    setIsProcessing(true);
    setProcessingType('longer');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Make text longer - add contextual expansion
      const expandedText = `${selectedText.trim()}. This concept can be further understood by considering the broader implications and contextual factors that influence the overall narrative structure and thematic development of the content.`;
      
      replaceSelectedText(expandedText);
    } catch (error) {
      console.error('Make longer failed:', error);
      alert('Failed to make text longer. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingType('');
    }
  };

  const handleCopyToClipboard = () => {
    const content = editorState.getCurrentContent().getPlainText();
    navigator.clipboard.writeText(content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text to clipboard.');
      });
  };

  return (
    <EditorContainer onClick={focusEditor}>
      <EditorToolbar
        fontSize={fontSize}
        setFontSize={setFontSize}
        canUndo={canUndo}
        canRedo={canRedo}
        hasSelection={hasSelection}
        wordCount={wordCount}
        isProcessing={isProcessing}
        processingType={processingType}
        handleMakeShorter={handleMakeShorter}
        handleMakeLonger={handleMakeLonger}
      />
      
      <EditorWrapper 
        fontSize={`${fontSize}px`} 
      >
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          customStyleMap={{
            HIGHLIGHT: {
              backgroundColor: 'yellow',
            },
          }}
        />
      </EditorWrapper>
      
      <EditorControls 
        handleParaphrasing={handleParaphrasing}
        handleExport={handleExport}
        handleCopyToClipboard={handleCopyToClipboard}
        isCopied={isCopied}
      />
    </EditorContainer>
  );
};

export default ScriptEditor;