import { ArticleModel } from "../models";
import { createRandom, makeAIDu } from "./creater";
import { checkBoard, pushNewArticle } from "./boardUtil";
import { checkUser } from "./userUtil";
import { createComment } from "./commentUtil";

const checkArticle = async (aid, errFunc) => {
  if(!aid) {
    throw new Error("Missing aid for: " + errFunc);
  }
  return ArticleModel.findOne({aid});
}

const pushNewComment = async (article, comment) => {
  article.comments = [...article.comments, comment];
  await article.save();
}

const createArticle = async (article) => {
  const board = await checkBoard(article.brdname, "createArticle");
  if(!board) {
    throw new Error(`board named ${article.brdname} not found for createArticle`);
  }
  article.board = board;  

  const owner = await checkUser(article.username, "createArticle");
  if(!owner) {
    throw new Error(`owner named ${article.username} not found for createArticle`);
  }
  article.owner = owner;

  if(!article.create_time) {
    article.create_time = new Date();

    const random_16_base = createRandom();
    article.aid = makeAIDu(article.create_time, random_16_base);
  }

  article.type = "normal";
  article.deleted = false;
  article.push = 0;
  article.boo = 0;

  article.ip = "8.8.8.8",
  article.last_modified_time = article.create_time;

  let plaincomments = null;
  if(article.plaincomments) {
    plaincomments = JSON.parse(JSON.stringify(article.plaincomments));
    delete article.plaincomments;
  }

  delete article.brdname;
  delete article.username;

  const newArticle = new ArticleModel(article);
  await newArticle.save();
  pushNewArticle(board, newArticle);

  // create comments
  if(plaincomments) {
    for(let comment of plaincomments) {
      await createComment(article.aid, comment);
    }
  }
}

export {
  checkArticle,
  pushNewComment,
  createArticle,
};