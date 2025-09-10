import { ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

// Helper function to get selected text
export const getSelectedText = (editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  
  if (selection.isCollapsed()) {
    return '';
  }
  
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();
  
  if (startKey === endKey) {
    // Selection is within a single block
    const block = contentState.getBlockForKey(startKey);
    return block.getText().slice(startOffset, endOffset);
  } else {
    // Selection spans multiple blocks
    let selectedText = '';
    let currentKey = startKey;
    
    while (currentKey) {
      const block = contentState.getBlockForKey(currentKey);
      const blockText = block.getText();
      
      if (currentKey === startKey) {
        selectedText += blockText.slice(startOffset) + '\n';
      } else if (currentKey === endKey) {
        selectedText += blockText.slice(0, endOffset);
        break;
      } else {
        selectedText += blockText + '\n';
      }
      
      currentKey = contentState.getKeyAfter(currentKey);
    }
    
    return selectedText;
  }
};

// Generate HTML for export
export const generateExportHTML = (editorState, fontSize = 14, fontFamily = 'Arial') => {
  const contentState = editorState.getCurrentContent();

  const exportOptions = {
    inlineStyles: {
      BOLD: { element: 'strong' },
      ITALIC: { element: 'em' },
      UNDERLINE: { element: 'u' }
    },
    blockStyleFn: (block) => {
      const type = block.getType();
      if (type === 'unstyled') {
        return {
          element: 'p',
          attributes: {
            style: 'margin-bottom: 12px; font-size: 14px; line-height: 1.6;'
          }
        };
      } else if (type.startsWith('header-')) {
        const headerStyleMap = {
          'header-one':   { level: 1, fontSize: '32px' },
          'header-two':   { level: 2, fontSize: '26px' },
          'header-three': { level: 3, fontSize: '20px' },
          'header-four':  { level: 4, fontSize: '16px' },
          'header-five':  { level: 5, fontSize: '12px' },
          'header-six':   { level: 6, fontSize: '10px' },
        };

        const level = headerStyleMap[type].level;
        const fontSize = headerStyleMap[type].fontSize;
        
        return {
          element: `h${level}`,
          attributes: {
            style: `margin-bottom: 16px; font-size: ${fontSize || '16px'}; font-weight: bold;`
          }
        };
      }
      return null;
    },
    entityStyleFn: (entity) => {
      const type = entity.getType();
      if (type === 'LINK') {
        return {
          element: 'a',
          attributes: {
            href: entity.getData().url,
            target: '_blank',
            style: 'color: #007BFF; text-decoration: underline;'
          }
        };
      }
      return null;
    }
  };

  const bodyContent = stateToHTML(contentState, exportOptions);

  // Wrap in styled container
  const fullHTML = `
    <div style="
      font-family: ${fontFamily};
      font-size: ${fontSize}px;
      padding: 20px;
      line-height: 1.6;
      color: #000;
      width: 100%;
      max-width: 800px;
      margin: auto;
    ">
      ${bodyContent}
    </div>
  `;
  return fullHTML;
}; 