var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

/* Sequelize.prototype.define =
  function(Modelname, attributes, options)
  ONLY THREE ARGUMENTS!
*/
var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        /* Can do Sequelize.STRING(10) to
        limit characters */
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        /* Much larger than STRING, still has character limit */
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed'),
        defaultValue: 'closed'
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    }
},{
    // Virtual methods stay within the same object!!
    getterMethods: {
        getRoutes: function () {
            var url = ('/wiki/') + this.urlTitle;
            return url;
        }
    },
    classMethods : {
        findByTag: function (tagArr) {
            return Page.findAll({
                where: {
                    tags: {
                        $overlap: tagArr
                    }
                }
            })
        }
    }, 
    instanceMethods : {
        findSimilar: function() {
            return Page.findAll({
                where: {
                    id : {
                        $ne: this.id
                    },
                    tags: {
                        $overlap: this.tags
                    }
                }
            })
        }
    },
    hooks: {
      beforeValidate: function (page) {
        if (page.title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
          page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
        } else {
    // Generates random 5 letter string
          page.urlTitle = Math.random().toString(36).substring(2, 7);
        }
      }
    }
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        },
        allowNull: false
    }
});


Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};


