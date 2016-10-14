// NPM Dependencies
import path from 'path';

// Local dependencies
import { glob } from '../../lib/utils/files';

// Application name
const app = 'blog';

// CRUD Views
const createView = `app/${app}/dashboard/create`;
const readView = `app/${app}/dashboard/read`;
const updateView = `app/${app}/dashboard/update`;
const deleteView = `app/${app}/dashboard/delete`;

export default (req, res, next) => {
  // Setting layout
  res.renderScope.default({
    layout: 'dashboard.hbs'
  });

  // Getting the action
  const action = req.params.action;

  // Methods
  res.blogDashboard = {
    createAction,
    readAction,
    updateAction,
    deleteAction
  };

  return next();

  /**
   * Create
   *
   * @returns {void} void
   */
  function createAction() {
    res.profileAllowed(userInfo => {
      res.content('Dashboard.modules.blog', true);

      // Setting some vars
      res.renderScope.set('userInfo', userInfo);
      res.renderScope.set('multimedia', glob(path.join(__dirname, '../../public/images/uploads')));
      res.renderScope.set('section', action === 'create' ? res.content('action') : res.content('name'));

      if (userInfo) {
        if (res.isPost()) {
          // Retreiving all post data
          const post = res.getAllPost();

          // Trying to save the post
          res.BlogModel.savePost(post, (result, errors) => {
            // Do we have some errors?
            if (errors) {
              // Getting the schema to re-render the form.
              res.BlogModel.getSchema(schema => {
                // Assigning the error messages to the schema
                Object.keys(errors).forEach(error => {
                  if (schema[error]) {
                    schema[error].errorMessage = errors[error];
                  }
                });

                res.renderScope.set('schema', schema);
                res.renderScope.set('flashData', post);
                res.render(createView, res.renderScope.get());
              });
            } else {
              // res.send('POST GUARDADO', result, errors);
              res.refreshSecurityToken();
            }
          });
        } else {
          res.BlogModel.getSchema(schema => {
            res.renderScope.set('schema', schema);
            res.render(createView, res.renderScope.get());
          });
        }
      }
    });
  }

  /**
   * Read
   *
   * @returns {void} void
   */
  function readAction() {
    res.profileAllowed(userInfo => {
      res.render(readView, res.renderScope.get());
    });
  }

  /**
   * Update
   *
   * @returns {void} void
   */
  function updateAction() {
    res.profileAllowed(userInfo => {
      res.render(updateView, res.renderScope.get());
    });
  }

  /**
   * Delete
   *
   * @returns {void} void
   */
  function deleteAction() {
    res.profileAllowed(userInfo => {
      res.render(deleteView, res.renderScope.get());
    });
  }
};
