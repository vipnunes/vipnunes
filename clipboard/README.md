# clipboard

A simple website for storing and retrieving text data.

The website utilizes the fetch API to interact with a Flask API hosted on [Render](https://render.com/). The Flask API is responsible for communicating with the Google Firebase Realtime Database to retrieve and update data.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The clipboard website provides a convenient way to store and access text data. It leverages the power of a Flask API hosted on Render and integrates with the Google Firebase Realtime Database for seamless data management.

## Features

- Store and retrieve text data easily.
- Seamless integration with Google Firebase Realtime Database.
- Fast and responsive user interface.

## Prerequisites

Before getting started, make sure you have the following:

- A Firebase project set up with a Realtime Database.
- The Firebase Admin SDK service account key JSON file.
- Python installed on your local machine.

## Installation and Setup

To set up the clipboard website locally, follow these steps:

### Flask API
1. Fork this repository to your github account.
1. Clone the forked repository to your local machine.
2. Copy the Firebase Admin SDK service account key JSON file to the project directory.
3. Install the required Python packages by running the following command:
```
pip install -r requirements.txt
```
4. Open the `main.py` file in a text editor.
5. Replace the `'databaseURL'` value in the `initialize_app` function with your Firebase Realtime Database URL.
6. Run the Flask application by executing the following command:
```
python main.py
```
7. Deploy the flask application to Render.
8. Open `assets/script.js` and `assets/script.js` files in a text editor.
9. Replace the `URL` to the url that the flask api is deployed to by Render.
10. Deploy your website using github pages or any other hosting service.

That's it!

## Usage

1. Access the clipboard website by navigating to the appropriate URL.
2. Use the provided text input field to enter your desired text data.
3. Click the "Add" button to store the text data in the database.
4. Existing clipboards are automatically retrived from the database.
5. The retrieved text data will be displayed on the website.

## Contributing

Contributions to the clipboard project are welcome! If you would like to contribute, please follow these steps:

1. Raise an issue over at issues tab and report to the developer
2. Fork the repository and create a new branch for your feature or bug fix.
3. Commit your changes with descriptive commit messages.
4. Push your branch to your forked repository.
5. Submit a pull request, detailing your changes and their benefits.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

