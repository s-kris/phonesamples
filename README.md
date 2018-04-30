# Phone Samples

Search, Browse & Upload Camera Samples of Mobile Phones

[LIVE VERSION](http://phonesamples.org)

### notes

* Created this when I was learning React & React Native
* Instead of HTML elements, [React Primitives](https://github.com/lelandrichardson/react-primitives) were used mostly
* This is my first open-source project, excuse any mistakes

## Todo

* Add firebase cloud function to remove GPS exif data upon photo upload
* Detect and blur offensive images that get uploaded
* Optimize **Feed**

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

```
npm (or) yarn
```

### Running a local copy

* Clone the repository

```
git clone https://github.com/s-kris/phonesamples.git
```

* Create a project and copy the config from firebase console to **src/config/FirebaseConfig.js**
  _(you can skip this step if you don't want to test firebase features)_

```
export const config = {
  apiKey: 'XXXXXXXXX',
  authDomain: 'XXXXXXXXX.firebaseapp.com',
  databaseURL: 'XXXXXXXXX.firebaseio.com',
  projectId: 'XXXXXXXXX',
  storageBucket: 'XXXXXXXXX.appspot.com',
  messagingSenderId: 'XXXXXXXXX',
};
```

* Run the local app

```
npm install (or) yarn install
npm start (or) yarn start
```

## Built With

* [create-react-app](https://github.com/facebook/create-react-app)
* [reactstrap](https://reactstrap.github.io)
* [react-primitives](https://github.com/lelandrichardson/react-primitives)
* [mobx](https://mobx.js.org)
* [react-app-rewired](https://github.com/timarney/react-app-rewired)
* [firebase](http://firebase.google.com)

## Contributing

Please read [CONTRIBUTING.md](https://github.com/s-kris/phonesamples/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Contributors

* Looking for contributors

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [unsplash](http://unsplash.com) - free stock images
* [mobx decorators without ejecting react app](https://github.com/leighhalliday/mobx-decorators-without-ejecting)
* [fonoapi](https://github.com/shakee93/fonoapi) - free phone models api service
