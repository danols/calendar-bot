"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { SlackService } from "./component/SlackService";
const Index_1 = require("./component/Index");
const MongoDataSource_1 = require("./datasource/MongoDataSource");
let mongods = new MongoDataSource_1.MongoDataSource();
mongods.init(function (err) {
    if (err) {
        console.log("Error onConnect Mongo DB");
    }
    else {
        console.log("Mongo DB Connected");
        //let githubService = new SlackService();
        let index = new Index_1.Index();
    }
});
// CLIENT ID
// 985403551651-baqupqale65djep3p3nc9s7ce780qpcl.apps.googleusercontent.com 
// SECRET
//  X7OCc3I04IBkhv-ei02_0Kf9  
