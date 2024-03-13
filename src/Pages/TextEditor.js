import { useEffect, useRef, useState } from "react";
import { Editor, convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { headingTextHandler } from "../utils/headingLine";
import { underlineTextHandler } from "../utils/underlineLine";
import { boldTextHandler } from "../utils/boldLine";
import { redTextHandler } from "../utils/redLine";
import { codeBlockHandler } from "../utils/codeBlock";

const TextEditor = () => {
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const [saved, setSaved] = useState(false);

	const refElement = useRef(null);
	useEffect(() => {
		let localItem = localStorage.getItem("editor_context");
		if (localItem) {
			const context = convertFromRaw(JSON.parse(localItem));
			setEditorState(EditorState.createWithContent(context));
		}
	}, []);

	const saveTextHandler = (e) => {
		localStorage.setItem(
			"editor_context",
			JSON.stringify(convertToRaw(editorState.getCurrentContent()))
		);
		setSaved(true);
	};

	//to give our css class
	const myBlockStyleFn = (contentBlock) => {
		const type = contentBlock.getType();
		if (type === "block-bold") {
			return "Bold";
		}
		if (type === "block-red") {
			return "Red";
		}
		if (type === "block-underline") {
			return "Underline";
		}
		if (type === "block-code") {
			return "code_block";
		}
	};

	const onChangeHandler = (editorState) => {
		setSaved(false);
		const selection = editorState.getSelection();
		const content = editorState.getCurrentContent();
		const formattingBlock = content.getBlockForKey(selection.getStartKey());
		const text = formattingBlock.getText(); //actual text
		const contentState = editorState.getCurrentContent();
		const selectionState = editorState.getSelection();
		const blockKey = formattingBlock.getKey();

		//Using js startsWith fn for strings
		if (text.startsWith("# ")) {
			const newEditorState = headingTextHandler(
				selectionState,
				contentState,
				formattingBlock,
				text, //text
				blockKey, //key for current block
				editorState //overall state
			);
			setEditorState(newEditorState);
			return true;
		} else if (text.startsWith("*** ")) {
			const newEditorState = underlineTextHandler(
				selectionState,
				contentState,
				formattingBlock,
				text,
				blockKey,
				editorState
			);
			setEditorState(newEditorState);
			return true;
		} else if (text.startsWith("** ")) {
			const newEditorState = redTextHandler(
				selectionState,
				contentState,
				formattingBlock,
				text,
				blockKey,
				editorState
			);
			setEditorState(newEditorState);
			return true;
		} else if (text.startsWith("* ")) {
			const newEditorState = boldTextHandler(
				selectionState,
				contentState,
				formattingBlock,
				text,
				blockKey,
				editorState
			);
			setEditorState(newEditorState);
			return true;
		} else if (text.startsWith("``` ")) {
			//Extra bonus conditon
			const newEditorState = codeBlockHandler(
				selectionState,
				contentState,
				formattingBlock,
				text,
				blockKey,
				editorState
			);
			setEditorState(newEditorState);
			return true;
		}
		setEditorState(editorState);
		return false;
	};

	return (
		<div className="container">
			<div className="nav_container">
				<div></div>
				<a
					href="https://www.linkedin.com/in/harshit-srivastava-4320481a2/"
					target="_blank"
					rel="noreferrer">
					<h2 className="text_title">Demo editor by Harshit Srivastava</h2>
				</a>

				<button onClick={saveTextHandler} className="btn">
					{saved ? "Saved !" : "Save Text"}
				</button>
			</div>
			<div
				className="texteditor_container"
				onClick={() => {
					refElement.current && refElement.current.focus();
				}}>
				<Editor
					ref={refElement}
					editorState={editorState}
					onChange={onChangeHandler}
					blockStyleFn={myBlockStyleFn}
					placeholder="Typing...       Use # , * , ** , *** , ``` followed with space to see magic"
				/>
			</div>
		</div>
	);
};

export default TextEditor;
