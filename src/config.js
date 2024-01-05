const config = {
  drawerWidth: '22vh',
  site: {
    title: {
      full: 'Code Smells Catalog',
      short: 'Smells Catalog',
      alt: 'Smells Catalog',
      letterer: 'CSC',
    },
    logo: '/logos/logo-1024.png',
    description: 'A collection of Bad Code Smells in a Catalog form for Developers & Researchers. Code Smell is a typical bad code implementation, and learning these concepts immediately makes you a better developer!',
    url: {
      path: 'http://luzkan.github.io',
      prefix: '/smells',
    },
    rss: {
      path: '/rss.xml',
    },
    apps: {
      googleAnalyticsID: 'G-GVXFN1P3JV',
    },
    copyright: 'Copyright © 2022 Marcel Jerzyk. All rights reserved.',
  },
  formatting: {
    date: {
      from: 'YYYY-MM-DD',
      to: 'DD/MM/YYYY'
    }
  },
  user: {
    name: 'Marcel Jerzyk',
    email: '244979@student.pwr.edu.pl',
    twitter: 'Luzkan',
    github: 'Luzkan',
  },
  theme: {
    color: {
      primary: '#000000',
      background: '#e2e2e2'
    }
  }
};

module.exports = config
