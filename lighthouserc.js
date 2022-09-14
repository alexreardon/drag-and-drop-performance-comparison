module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/scenario/baseline',
        'http://localhost:3000/scenario/react-beautiful-dnd',
        'http://localhost:3000/scenario/atlaskit-drag-and-drop',
        'http://localhost:3000/scenario/deferred-atlaskit-drag-and-drop',
        'http://localhost:3000/scenario/react-dnd',
      ],
      startServerCommand: 'yarn start',
    },
    // upload: {
    //   target: 'temporary-public-storage',
    // },
  },
};
