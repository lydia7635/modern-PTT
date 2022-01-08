import { getHotBrdnameList } from "../utilities/creater";

const Query = {
  async board(parent, { brdname }, { db }, info) {
    console.log(brdname)
    return await db.BoardModel.findOne({brdname});
  },

  async boards(parent, { keywords }, { db }, info) {
    if(!keywords) {
      return await db.BoardModel.find();
    }

    const regexStr = keywords.join('|');
    return await db.BoardModel.find({
      "$or": [
        { brdname: {$regex: regexStr, $options: "i"} },
        { title: {$regex: regexStr, $options: "i"} },
        { class: {$regex: regexStr, $options: "i"} },
      ]
    })
  },

  async article(parent, { aid }, { db }, info) {
    return await db.ArticleModel.findOne({aid});
  },

  async articles(parent, { input: { brdname, owner, title, timerange } }, { db }, info) {
    let filter = [];
    if(brdname && brdname.length !== 0) {
      const brdnameFilter = brdname.map(e => {
        return new RegExp(e, "i");
      });
      filter.push({
        brdname: {$in: brdnameFilter}
      });
    }

    if(owner) {
      filter.push({
        owner: {$regex: new RegExp(owner, "i")}
      });
    }

    if(title && title.length !== 0) {
      const titleFilter = title.map(e => {
        return new RegExp(e, "i");
      });
      filter.push({
        title: {$in: titleFilter}
      });
    }

    if(timerange && timerange > 0) {
      filter.push({
        create_time: {
          $gte: new Date(new Date().getTime() - timerange * 60 * 60 * 1000)
        }
      })
    }

    if(filter.length === 0) {
      return await db.ArticleModel.find();
    }
    else {
      return await db.ArticleModel.find({
        "$and": filter
      });
    }
  },

  async user(parent, { username }, { db}, info) {
    return await db.UserModel.findOne({username});
  },

  async hotBoards(parent, args, { db }, info) {
    const hot_brdname_list = getHotBrdnameList();
    return Promise.all(
      hot_brdname_list.map(
        (brdname) => db.BoardModel.findOne({brdname})
      )
    );
  },

  async newestArticles(parent, { limit }, { db }, info) {
    let queryNum = 50;
    if(limit !== null && limit > 0 && limit <= queryNum) {
      queryNum = limit;
    }
    return await db.ArticleModel.find({})
                                .sort({create_time: -1})
                                .limit(queryNum);;
  },

  async hotArticles(parent, { input }, { db }, info) {
    let limit = (input)? input.limit : null;
    let timerange = (input)? input.timerange : null;
    let queryNum = 100;
    let timeRangeHour = 3 * 30 * 24;
    if(limit !== null && limit > 0 && limit <= queryNum) {
      queryNum = limit;
    }
    if(timerange !== null && timerange > 0 && timerange) {
      timeRangeHour = timerange;
    }
    return await db.ArticleModel.aggregate([
      {
        "$addFields": {
          pushRank: {
            "$subtract": ["$push", "$boo"]
          }
        }
      },
      { 
        "$match": {
          create_time: {
            $gte: new Date(new Date().getTime() - timeRangeHour * 60 * 60 * 1000)
          },
          pushRank: {
            $gt: 0
          },
        }
      },
      { 
        "$sort": {
          pushRank: -1,
          push: -1,
        }
      },
      {
        "$limit": queryNum
      },
    ])
  },
};

export { Query as default };