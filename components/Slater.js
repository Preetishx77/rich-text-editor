import React, { useCallback, useEffect, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import format_bold from '../format_bold.svg'
import format_italic from '../format_italic.svg'
import format_underlined from '../format_underlined.svg'
import code from '../Vector (6).svg'
import red from '../circle (1) (2).png'
import blue from '../circle (2) (2).png'
import yellow from '../circle (3) (2).png'
import looks_one from '../Vector (7).svg'
import looks_two from '../Vector (8).svg'
import format_quote from '../Vector (11).svg'
import format_list_bulleted from '../Vector (10).svg'
import format_list_numbered from '../Vector (9).svg'
import { Button, Toolbar } from "./SlaterComponent.js";
import Image from "next/image";
import { insertLink } from "./Link/Linkutil";
import Link from "./Link/Link";
import { Row, Col } from 'react-bootstrap'

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code"
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];



const Slater = (props) => {
  const [value, setValue] = useState(props.initialValue);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <>
      <Slate editor={editor} value={value} onChange={value => {setValue(value);props.onChange(value)}} >
        <Toolbar>

          <MarkButton format="bold" icon={format_bold} ></MarkButton>
          <MarkButton format="italic" icon={format_italic} />
          <MarkButton format="underline" icon={format_underlined} />
          <MarkButton format="code" icon={code} />
          <MarkButton format="red" icon={red}>Red</MarkButton>
          <MarkButton format="blue" icon={blue}>Blue</MarkButton>
          <MarkButton format="yellow" icon={yellow}>Yellow</MarkButton>
          <BlockButton format="left-align" icon={looks_one} />
          <BlockButton format="center-align" icon={looks_two} />
          <BlockButton format="link" icon={format_quote} />

          <BlockButton format="bulleted-list" icon={format_list_bulleted} />
          <BlockButton format="numbered-list" icon={format_list_numbered} />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
      <Row>
      


{console.log(value)}

      </Row>

    </>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format, tagName) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
   
    if(tagName){
      Editor.removeMark(editor, {format, tagName}, true);
    }
    else{
      Editor.removeMark(editor, format);
    }
  } else {   
    if(tagName){
      Editor.addMark(editor, format, tagName, true);

    }
    else{
      Editor.addMark(editor, format, true);
    }
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });

  return !!match;
};

const handleInsertLink = () => {
  const url = prompt("Enter a URL");
  insertLink(editor, url);
};
const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "left-align":
      return <div style={{ textAlign: 'left' }} {...attributes}>{children}</div>;
    // case "link":
    //   return <Link {...attributes} {...element} {...children} />;

    case "center-align":
      return <div style={{ textAlign: 'center' }} {...attributes}>{children}</div>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;

  }
  if (leaf.red) {
    children = <span style={{ backgroundColor: '#f09a92' }}>{children}</span>;
  }
  if (leaf.blue) {
    children = <span style={{ backgroundColor: '#4aaeff' }}>{children}</span>;
  }
  if (leaf.yellow) {
    children = <span style={{ backgroundColor: '#f5ff70' }}>{children}</span>;
  }



  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Image src={icon}></Image>
    </Button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
if(format === 'blue' || format === 'red' || format === 'yellow'){
  return (
    <Button
    active={isMarkActive(editor, format)}
    onMouseDown={event => {
      event.preventDefault();
      let tagName = prompt('Enter a tag Name');
      if (tagName !== ''){
        toggleMark(editor, format, tagName);
      
      }

    }}
  >
    <Image src={icon} ></Image>
  </Button>
    
  )
}

  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Image src={icon}></Image>
    </Button>
  );
};



export default Slater;