import AuthView from '../pages/auth/auth-view';
import AuthPresenter from '../pages/auth/auth-presenter';
import RegisterView from '../pages/auth/register-view';
import RegisterPresenter from '../pages/auth/register-presenter';
import StoriesView from '../pages/stories/stories-view';
import StoriesPresenter from '../pages/stories/stories-presenter';
import MapsView from '../pages/maps/maps-view';
import MapsPresenter from '../pages/maps/maps-presenter';
import AddStoryView from '../pages/add-story/add-story-view';
import AddStoryPresenter from '../pages/add-story/add-story-presenter';
import StoryDetailView from '../pages/story-detail/story-detail-view';
import StoryDetailPresenter from '../pages/story-detail/story-detail-presenter';
import AuthService from '../services/auth-service';
import StoryService from '../services/story-service';
import Home from '../views/pages/home';
import Login from '../views/pages/login';
import Register from '../views/pages/register';
import NotFound from '../views/pages/not-found';

const authService = new AuthService();
const storyService = new StoryService();

const routes = {
  '/': {
    init: () => {
      const view = new StoriesView();
      return new StoriesPresenter({ view, storyService });
    },
    needAuth: true,
  },
  '/login': {
    init: () => {
      const view = new AuthView();
      return new AuthPresenter({ view, authService });
    },
    needAuth: false,
  },
  '/register': {
    init: () => {
      const view = new RegisterView();
      return new RegisterPresenter({ view, authService });
    },
    needAuth: false,
  },
  '/maps': {
    init: () => {
      const view = new MapsView();
      return new MapsPresenter({ view, storyService });
    },
    needAuth: true,
  },
  '/add': {
    init: () => {
      const view = new AddStoryView();
      return new AddStoryPresenter({ view, storyService });
    },
    needAuth: true,
  },
  '/stories/:id': {
    init: (params) => {
      const view = new StoryDetailView();
      return new StoryDetailPresenter({ view, storyService, storyId: params.id });
    },
    needAuth: true,
  },
  '*': {
    init: () => NotFound,
    needAuth: false,
  },
};

export default routes;
