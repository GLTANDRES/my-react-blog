import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import classes from "./NewArticle.module.css";
import Compressor from "compressorjs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import firebase from "../../Config/firebase";
import { v4 as uuidv4 } from "uuid";
import AudioWorker from "./AudioWorker/AudioWorker";
const Quill = ReactQuill.Quill;
const BlockEmbed = Quill.import("blots/block/embed");

const db = firebase.firestore();
const storageRef = firebase.storage();

class AudioBlot extends BlockEmbed {
  static create(url) {
    let node = super.create();
    node.setAttribute("src", url);
    node.setAttribute("controls", "");
    return node;
  }

  static(node) {
    return node.getAttribute("src");
  }
}

AudioBlot.blotName = "audio";
AudioBlot.tagName = "audio";
Quill.register(AudioBlot);

class NewArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {
        title: "",
        content: "",
        createDate: new Date(),
        featureImage: "",
        isPublish: false,
        lastModified: new Date(),
        createUserID: "",
      },
    };
  }

  modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "stricke", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
        ["code-block"],
      ],
      handlers: {
        image: () => this.quillImageCallback(),
      },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
    "audio",
  ];

  onChangeArticleTitle = (value) => {
    this.setState({
      article: {
        ...this.state.article,
        title: value,
      },
    });
  };

  onChangeArticleContent = (value) => {
    this.setState({
      article: {
        ...this.state.article,
        content: value,
      },
    });
  };

  onChangePublish = (val) => {
    this.setState({
      article: {
        ...this.state.article,
        isPublish: val === "True",
      },
    });
  };

  submitArticle = () => {
    const article = this.state.article;
    article.createUserID = this.props.auth.uid;
    db.collection("Article")
      .add(article)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  fileCompress = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        file: "File",
        quality: 0.0,
        maxWidth: 648,
        maxHeight: 648,
        success(file) {
          return resolve({
            success: true,
            file: file,
          });
        },
        error(err) {
          return resolve({
            success: false,
            message: err.message,
          });
        },
      });
    });
  };

  quillImageCallback = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      const compressState = await this.fileCompress(file);
      if (compressState.success) {
        const fileName = uuidv4();
        storageRef
          .ref()
          .child("Article/" + fileName)
          .put(compressState.file)
          .then(async (snapshot) => {
            const downloadURL = await storageRef
              .ref()
              .child("Article/" + fileName)
              .getDownloadURL();
            let quill = this.quill.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, "image", downloadURL);
          });
      }
    };
  };

  uploadImageCallBack = (e) => {
    return new Promise(async (resolve, reject) => {
      const file = e.target.files[0];
      const fileName = uuidv4();
      storageRef
        .ref()
        .child("Article/" + fileName)
        .put(file)
        .then(async (snapshot) => {
          const downloadURL = await storageRef
            .ref()
            .child("Article/" + fileName)
            .getDownloadURL();

          console.log(downloadURL);

          resolve({
            success: true,
            data: { link: "" },
          });
        });
    });
  };

  insertTTSAudio = (soundURL) => {
    let quill = this.quill.getEditor();
    const range = quill.getSelection(true);
    let position = range ? range.index : 0;
    quill.insertEmbed(position, "audio", soundURL, "user");
  };

  render() {
    return (
      <Container>
        <Row>
          <Col xl={9} lg={9} md={8} sm={12} xs={12}>
            <h2 className={classes.SectionTitle}> New Article</h2>
            <FormGroup>
              <Label className={classes.Label}>Title</Label>
              <Input
                type="text"
                name="articleTitle"
                id="articleTitle"
                placeholder=""
                onChange={(e) => this.onChangeArticleTitle(e.target.value)}
                value={this.state.article.title}
              />
            </FormGroup>

            <FormGroup>
              <AudioWorker insertTTSAudio={this.insertTTSAudio} />
              <ReactQuill
                ref={(el) => (this.quill = el)}
                value={this.state.article.content}
                onChange={(e) => this.onChangeArticleContent(e)}
                theme="snow"
                modules={this.modules}
                formats={this.formats}
              />
            </FormGroup>
          </Col>

          <Col xl={3} lg={3} md={4} sm={12} xs={12}>
            <Card>
              <CardHeader>Article Setting</CardHeader>
              <CardBody>
                <FormGroup>
                  <Label className={classes.Label}>Publish</Label>
                  <Input
                    type="select"
                    name="publish"
                    id="publish"
                    onChange={(e) => this.onChangePublish(e.target.value)}
                  >
                    <option>False</option>
                    <option>True</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label className={classes.Label}>Feature Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className={classes.ImageUploader}
                    onChange={async (e) => {
                      const uploadState = await this.uploadImageCallBack(e);
                      if (uploadState.success) {
                        this.setState({
                          hasFeatureImage: true,
                          article: {
                            ...this.state.article,
                            featureImage: uploadState.data.link,
                          },
                        });
                      }
                    }}
                  ></Input>

                  {this.state.hasFeatureImage ? (
                    <img
                      src={this.state.article.featureImage}
                      className={classes.FeatureImg}
                    />
                  ) : (
                    ""
                  )}
                </FormGroup>
                <FormGroup>
                  <Button color="danger" onClick={(e) => this.submitArticle()}>
                    Submit
                  </Button>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default NewArticle;
