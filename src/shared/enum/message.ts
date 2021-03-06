export enum MESSAGE_EVENT {
  SUCCESS = 'msg-success',
  ERROR = 'msg-error',
  INFO = 'msg-info',
}

export enum MESSAGE {
  ALREADY_REGISTERED_APP = 'This app is already registered.',
  DELETE_ALL_APPS = 'Do you want to delete all apps?',
  DELETE_APP = 'Do you want to delete this app?',
  QUIT_LOSET = 'Are you sure you want to quit?',
  STOP_APPS = 'Do you want to stop all apps?',
  NOT_FOUND_COMMAND = 'Command not found.<br/>Please edit the command.',
  DELETE_GROUP = 'Do you want to delete this group?',
  DELETE_APPS_IN_GROUP = '{appCount} apps in the group.\nAre you sure you want to delete all apps?',
  RESET = 'Unable to recover after reset.\nDo you want to reset?',
  COMPLETED_RESET = 'Reset completed.',
}
