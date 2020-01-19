const app = {
  type: 'object',
  required: ['id', 'dir', 'start_cmd'],
  properties: {
    id: {
      type: 'string',
      minLength: 1,
      maxLength: 128,
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
    },
    dir: {
      type: 'string',
      minLength: 1,
      maxLength: 128,
    },
    start_cmd: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    auto_start: {
      type: 'boolean',
    },
    hc: {
      type: 'boolean',
    },
    hc_port: {
      type: 'number',
      minimum: 1,
      maximum: 66635,
    },
    hc_path: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    hc_interval: {
      type: 'number',
      minimum: 5000,
      maximum: 60000,
    },
  },
}

export const schema = {
  apps: {
    type: 'array',
    items: app,
  },
  config: {
    type: 'object',
    properties: {
      auto_start: {
        type: 'boolean',
      },
    },
  },
}
