var config = {
    "routes": {
        "/": {
            "template": "modules/agg/agg.html",
            "title": "Агрегаторы",
            "controller": "aggCtrl",
            "class": "-nopaddings",
            "access": "superadmin aggregator.admin aggregator.user"
        },
        "/software/": {
            "template": "modules/software/software.html",
            "title": "Версии ПО агрегатора",
            "controller": "softwareCtrl",
            "access": "superadmin aggregator.user"
        },
        "/generator/": {
            "template": "modules/generator/generator.html",
            "title": "Генератор трафика",
            "controller": "generatorCtrl",
            "class": "-nopaddings"
        },
        "/users/": {
            "template": "modules/users/users.html",
            "title": "Пользователи",
            "controller": "usersCtrl",
            "access": "superadmin"
        },
        "/dev/": {
            "template": "modules/dev/dev.html",
            "title": "DEV",
            "hidden": true,
            "controller": "devCtrl"
        }
    },
    "errors": {
        "INVALID_PARAMS": {
            "code": -32602,
            "message": "Invalid params"
        },
        "SERVER_ERROR": {
            "code": -32001,
            "message": "Ошибка на сервере"
        },
        "FORBIDDEN": {
            "code": -32011,
            "message": "Недостаточно прав"
        },
        "UNAUTORIZED": {
            "code": -32012,
            "message": "Пользователь неавторизован"
        },
        "LOGIN_FAILED": {
            "code": -32021,
            "message": "Неправильный логин/пароль"
        },
        "DUPLICATE_USER": {
            "code": -32022,
            "message": "Пользователь с таким именем уже существует"
        }
    },
    "api": {
        "users": {
            "description": "Basic users model",
            "roles": {
                "user": "Пользователь",
                "superadmin": "Администратор",
                "aggregator.user": "Доступ к агрегаторам",
                "aggregator.admin": "Администратор агрегаторов"
            },
            "model": {
                "description": "Schema for user",
                "properties": {
                    "id": "number",
                    "date": "date",
                    "name": "string",
                    "password": "string",
                    "role": "string",
                    "state": {
                        "enum": [
                            "BAN",
                            "ACTIVE",
                            "NEW"
                        ]
                    }
                }
            },
            "defaults": {
                "name": 1,
                "password": 1,
                "state": "ACTIVE",
                "role": "superadmin"
            },
            "methods": {
                "get": {
                    "response": {
                        "id": "number",
                        "date": "date",
                        "name": "string",
                        "state": "string",
                        "role": "string"
                    },
                    "access": "superadmin"
                },
                "login": {
                    "params": {
                        "name": {
                            "type": "string",
                            "minLength": 1
                        },
                        "password": {
                            "type": "string",
                            "minLength": 1
                        }
                    },
                    "required": [
                        "name",
                        "password"
                    ],
                    "response": {
                        "token": "string",
                        "user": {
                            "id": "number",
                            "date": "date",
                            "name": "string",
                            "password": "string",
                            "role": "string",
                            "state": {
                                "enum": [
                                    "BAN",
                                    "ACTIVE",
                                    "NEW"
                                ]
                            }
                        }
                    },
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "minLength": 1
                            },
                            "password": {
                                "type": "string",
                                "minLength": 1
                            }
                        },
                        "required": [
                            "name",
                            "password"
                        ]
                    }
                },
                "logout": {
                    "params": {
                        "token": "string"
                    },
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "token": {
                                "type": "string"
                            }
                        }
                    }
                },
                "update": {
                    "params": {
                        "id": "number",
                        "date": "date",
                        "name": "string",
                        "password": "string",
                        "role": "string",
                        "state": {
                            "enum": [
                                "BAN",
                                "ACTIVE",
                                "NEW"
                            ]
                        }
                    },
                    "access": "superadmin",
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number"
                            },
                            "date": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            },
                            "password": {
                                "type": "string"
                            },
                            "role": {
                                "type": "string"
                            },
                            "state": {
                                "enum": [
                                    "BAN",
                                    "ACTIVE",
                                    "NEW"
                                ]
                            }
                        }
                    }
                },
                "changePassword": {
                    "params": {
                        "id": {
                            "type": "number",
                            "minLength": 1
                        },
                        "password": {
                            "type": "string",
                            "minLength": 1
                        }
                    },
                    "required": [
                        "id",
                        "password"
                    ],
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "minLength": 1
                            },
                            "password": {
                                "type": "string",
                                "minLength": 1
                            }
                        },
                        "required": [
                            "id",
                            "password"
                        ]
                    }
                },
                "remove": {
                    "params": {
                        "id": {
                            "type": "number",
                            "minLength": 1
                        }
                    },
                    "required": [
                        "id"
                    ],
                    "access": "superadmin",
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "minLength": 1
                            }
                        },
                        "required": [
                            "id"
                        ]
                    }
                },
                "switchState": {
                    "params": {
                        "id": {
                            "type": "number",
                            "minLength": 1
                        },
                        "state": {
                            "enum": [
                                "BAN",
                                "ACTIVE",
                                "NEW"
                            ]
                        }
                    },
                    "required": [
                        "id",
                        "state"
                    ],
                    "access": "superadmin",
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "minLength": 1
                            },
                            "state": {
                                "enum": [
                                    "BAN",
                                    "ACTIVE",
                                    "NEW"
                                ]
                            }
                        },
                        "required": [
                            "id",
                            "state"
                        ]
                    }
                },
                "register": {
                    "params": {
                        "name": {
                            "type": "string",
                            "minLength": 1
                        },
                        "password": {
                            "type": "string",
                            "minLength": 1
                        }
                    },
                    "required": [
                        "name",
                        "password"
                    ],
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "minLength": 1
                            },
                            "password": {
                                "type": "string",
                                "minLength": 1
                            }
                        },
                        "required": [
                            "name",
                            "password"
                        ]
                    }
                }
            }
        },
        "agg": {
            "description": "Aggregators",
            "roles": {
                "read": "superadmin aggregators.admin aggregators.user",
                "write": "superadmin aggregators.admin"
            },
            "model": {
                "id": {
                    "type": "number",
                    "minLength": 1
                },
                "date": "date",
                "sn": "string",
                "description": "string",
                "license": "array"
            },
            "license": {
                "id": {
                    "type": "number",
                    "minLength": 1
                },
                "ports": {
                    "type": "number",
                    "minimum": 1,
                    "maximum": 64
                },
                "mpls": "boolean",
                "mirror": "boolean"
            },
            "methods": {
                "get": {
                    "access": "superadmin aggregators.admin aggregators.user"
                },
                "add": {
                    "params": {
                        "sn": {
                            "type": "string",
                            "minLength": 1
                        },
                        "description": "string"
                    },
                    "access": "superadmin aggregators.admin",
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "sn": {
                                "type": "string",
                                "minLength": 1
                            },
                            "description": {
                                "type": "string"
                            }
                        }
                    }
                },
                "update": {
                    "params": {
                        "id": {
                            "type": "number",
                            "minLength": 1
                        },
                        "date": "date",
                        "sn": "string",
                        "description": "string",
                        "license": "array"
                    },
                    "required": [
                        "id"
                    ],
                    "access": "superadmin aggregators.admin",
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "minLength": 1
                            },
                            "date": {
                                "type": "string"
                            },
                            "sn": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "license": {
                                "type": "array"
                            }
                        },
                        "required": [
                            "id"
                        ]
                    }
                },
                "remove": {
                    "params": {
                        "id": {
                            "type": "number",
                            "minLength": 1
                        }
                    },
                    "required": [
                        "id"
                    ],
                    "access": "superadmin aggregators.admin",
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "minLength": 1
                            }
                        },
                        "required": [
                            "id"
                        ]
                    }
                },
                "licenseadd": {
                    "params": {
                        "id": {
                            "type": "number",
                            "minLength": 1
                        },
                        "ports": {
                            "type": "number",
                            "minimum": 1,
                            "maximum": 64
                        },
                        "mpls": "boolean",
                        "mirror": "boolean"
                    },
                    "required": [
                        "id"
                    ],
                    "access": "superadmin aggregators.admin",
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "minLength": 1
                            },
                            "ports": {
                                "type": "number",
                                "minimum": 1,
                                "maximum": 64
                            },
                            "mpls": {
                                "type": "boolean"
                            },
                            "mirror": {
                                "type": "boolean"
                            }
                        },
                        "required": [
                            "id"
                        ]
                    }
                }
            }
        },
        "software": {
            "description": "Software model",
            "model": {
                "date": "date",
                "name": "string"
            },
            "methods": {
                "list": {
                    "response": {
                        "date": "date",
                        "name": "string"
                    }
                }
            }
        },
        "generator": {
            "description": "Generators",
            "filemodel": {
                "date": "date",
                "name": "string",
                "username": "string",
                "size": "integer"
            },
            "genmodel": {
                "id": {
                    "type": "number",
                    "minLength": 1
                },
                "name": "string",
                "state": "string",
                "files": "array",
                "out": "integer",
                "bitrate": "integer",
                "loop": "boolean",
                "swarm": "boolean"
            },
            "methods": {
                "get": {
                    "response": {
                        "id": {
                            "type": "number",
                            "minLength": 1
                        },
                        "name": "string",
                        "state": "string",
                        "files": "array",
                        "out": "integer",
                        "bitrate": "integer",
                        "loop": "boolean",
                        "swarm": "boolean"
                    }
                },
                "add": {
                    "params": {
                        "name": "string"
                    },
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            }
                        }
                    }
                },
                "update": {
                    "params": {
                        "id": {
                            "type": "number",
                            "minLength": 1
                        },
                        "name": "string",
                        "state": "string",
                        "files": "array",
                        "out": "integer",
                        "bitrate": "integer",
                        "loop": "boolean",
                        "swarm": "boolean"
                    },
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "minLength": 1
                            },
                            "name": {
                                "type": "string"
                            },
                            "state": {
                                "type": "string"
                            },
                            "files": {
                                "type": "array"
                            },
                            "out": {
                                "type": "integer"
                            },
                            "bitrate": {
                                "type": "integer"
                            },
                            "loop": {
                                "type": "boolean"
                            },
                            "swarm": {
                                "type": "boolean"
                            }
                        }
                    }
                },
                "remove": {
                    "params": {
                        "id": {
                            "type": "number",
                            "minLength": 1
                        }
                    },
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "minLength": 1
                            }
                        }
                    }
                },
                "getFiles": {
                    "response": {
                        "date": "date",
                        "name": "string",
                        "username": "string",
                        "size": "integer"
                    }
                },
                "removeFile": {
                    "params": {
                        "id": {
                            "type": "number",
                            "minLength": 1
                        }
                    },
                    "jsonschema": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "minLength": 1
                            }
                        }
                    }
                }
            }
        }
    },
    "wsport": 3001,
    "port": 3000,
    "baseUri": "ws://localhost",
    "description": null,
    "title": "Aggregator GUI"
};
