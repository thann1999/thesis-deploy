const readline = require('readline');
const fs = require('fs');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
async function uploadImageGoogleDrive(file) {
  try {
    const content = fs.readFileSync('./credentials.json', 'utf-8');
    // Authorize a client with credentials, then call the Google Drive API.
    return await authorize(JSON.parse(content), uploadImage, file);
  } catch (error) {
    throw error;
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, callback, file) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  try {
    const token = fs.readFileSync(TOKEN_PATH);
    // Check if we have previously stored a token.
    oAuth2Client.setCredentials(JSON.parse(token));
    return await callback(file, oAuth2Client);
  } catch (error) {
    return getAccessToken(oAuth2Client, callback);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

async function uploadImage(file, auth) {
  try {
    const drive = google.drive({ version: 'v3', auth: auth });
    const fileMetadata = {
      parents: ['1MvxPO3xHZzbFe1mmLN99fXAUx6I_QSgY'],
      name: file.filename,
    };
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });
    fs.unlinkSync(file.path)
    return response.data.id;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  uploadImageGoogleDrive: uploadImageGoogleDrive,
};
