const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getAllTags() {
  try {
    const response = await fetch('https://api.github.com/repos/BardBerry/infra-template/git/refs/tags');
    if (response.ok) {
      const data = await response.json();
      if (data.length < 2) {
        getAllCommits();
      } else {
        const regex = /rc-0.0.[0-9]+/;
        let lastTag = regex.exec(data.pop().ref)[0];
        let tagBeforeLast = regex.exec(data.pop().ref)[0];
        getAllCommits(lastTag, tagBeforeLast);
      }
    }
    else {
      getAllCommits();
    }
  } catch (error) {
    console.log(error);
  }
}


async function getAllCommits(lastTag = '', tagBeforeLast = '') {
  try {
    const {OAUTH, ACTOR, RELEASE, ORG_ID} = process.env;
    if (lastTag && tagBeforeLast) {
      const response = await fetch('https://api.github.com/repos/BardBerry/infra-template/compare/rc-0.0.1...rc-0.0.6');
      if (response.ok) {
        const data = await response.json();
        const commits = data.commits.map((el) => {
          return `${el.commit.author.name} - ${el.commit.message}`;
        }).join('\n');
  
        console.log(commits);
      }
    } else {
      const response = await fetch('https://api.github.com/repos/BardBerry/infra-template/commits');
      if (response.ok) {
        const data = await response.json();
        const commits = data.map((el) => {
          return `${el.sha} ${el.commit.author.name} ${el.commit.message}`;
        }).join('\n');
  
        console.log(commits);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

getAllTags();