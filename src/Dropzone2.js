import { Button, Paper } from "@material-ui/core";
import React, { Component } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import { DropzoneDialog } from "material-ui-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import MUIRichTextEditor from "mui-rte";
import { stateToHTML } from "draft-js-export-html";
import {
  convertFromHTML,
  convertToRaw,
  ContentState,
  EditorState,
  TMUIRichTextEditorRef
} from "draft-js";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: theme.spacing(4, 0, 2)
  }
}));

function generate(input, createElement) {
  return input.map(value => {
    let element = createElement(value);
    return React.cloneElement(element, {
      key: value
    });
  });
}

function InteractiveList(props) {
  const classes = useStyles();
  const [dense, setDense] = React.useState(true);
  const [secondary, setSecondary] = React.useState(false);
  const [inputData, setInputData] = React.useState(
    props.inputData ? props.inputData : []
  );

  console.log("rendering InteractiveList", inputData);

  const sampleMarkup =
    "<b>Bold text</b>, <h1>HELLO!</h1>, <i>Italic text</i><br/ ><br />" +
    '<a href="http://www.facebook.com">Example link</a>';
  const blocksFromHTML = convertFromHTML(sampleMarkup);
  const editorState = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );

  const editorStateRaw = convertToRaw(editorState);

  const editorRef = React.useRef();

  const deleteItem = id => {
    console.log("delete", id);
  };

  const onEditorChange = state => {
    console.log(editorRef.current);
    var text = stateToHTML(state.getCurrentContent());
    console.log(text);
  };

  return (
    <div className={classes.root}>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={dense}
              onChange={event => setDense(event.target.checked)}
            />
          }
          label="Enable dense"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={secondary}
              onChange={event => setSecondary(event.target.checked)}
            />
          }
          label="Enable secondary text"
        />
      </FormGroup>
      <Grid container spacing={2} variant="outlined">
        <Grid item xs={12} md={6} variant="contained">
          <Paper>
            <MUIRichTextEditor
              onChange={onEditorChange}
              ref={editorRef}
              defaultValue={JSON.stringify(editorStateRaw)}
              label="Start typing..."
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Email Attachments
            <p>Ilker</p>
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {generate(props.inputData, data => {
                return (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={data.fileName}
                      secondary={true ? data.fileTypeLabel : null}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon onClick={() => deleteItem(data.id)} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default function Dropzone2() {
  const [open, setOpen] = React.useState(false);
  const [inputData, setInputData] = React.useState([]);

  console.log("update Dropzone2", inputData);

  return (
    <div>
      <InteractiveList inputData={inputData} />
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Attachment
      </Button>

      <DropzoneDialog
        acceptedFiles={["image/*"]}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={5000000}
        open={open}
        onClose={() => setOpen(false)}
        onSave={files => {
          console.log("Files:", files, inputData);
          var filesData = inputData;
          files.forEach(file => {
            filesData.push({ id: file.path, fileName: file.path });
          });
          console.log(filesData);
          setInputData(filesData);
          console.log("inputData", inputData);
          setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </div>
  );
}
