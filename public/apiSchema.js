var apiSchema = {
    "auth": {
        "description": "User password authetification",
        "methods": {
            "login": {
                "params": {
                    "username": "string",
                    "password": "string"
                },
                "response": {
                    "token": "string"
                }
            },
            "logout": {
                "params": {
                    "token": "string"
                }
            }
        }
    },
    "users": {
        "description": "Basic users model",
        "roles": {
            "user": "Пользователь",
            "superadmin": "Администратор",
            "aggregator.user": "Доступ к агрегаторам",
            "aggregator.admin": "Администратор агрегаторов"
        },
        "model": {
            "id": "string",
            "date": "date",
            "name": "string",
            "password": "string",
            "state": "boolean",
            "role": "string"
        },
        "defaults": {
            "name": "admin",
            "password": 0,
            "state": true,
            "role": "superadmin"
        },
        "methods": {
            "get": {
                "response": {
                    "id": "string",
                    "date": "date",
                    "name": "string",
                    "state": "boolean",
                    "role": "string"
                },
                "access": "superadmin"
            },
            "update": {
                "params": {
                    "id": "string",
                    "date": "date",
                    "name": "string",
                    "password": "string",
                    "state": "boolean",
                    "role": "string"
                },
                "access": "superadmin"
            },
            "changePassword": {
                "params": {
                    "id": "string",
                    "password": "string"
                }
            },
            "remove": {
                "params": {
                    "id": "string"
                },
                "access": "superadmin"
            },
            "switchState": {
                "params": {
                    "id": "string",
                    "state": "boolean"
                },
                "access": "superadmin"
            },
            "register": {
                "params": {
                    "name": "string",
                    "password": "string"
                }
            }
        }
    },
    "agg": {
        "description": "Aggregators",
        "roles": {
            "read": "superdmin aggregators.admin aggregators.user",
            "write": "superdmin aggregators.admin"
        },
        "model": {
            "_id": "string",
            "_date": "date",
            "sn": "string",
            "description": "string",
            "license": "array"
        },
        "license": {
            "_id": "string",
            "_date": "date",
            "ports": "number",
            "mpls": "boolean",
            "mirror": "boolean",
            "filename": "string"
        },
        "methods": {
            "get": {
                "access": "superdmin aggregators.admin aggregators.user"
            },
            "add": {
                "params": {
                    "_id": "string",
                    "_date": "date",
                    "sn": "string",
                    "description": "string",
                    "license": "array"
                },
                "access": "superdmin aggregators.admin"
            },
            "update": {
                "params": {
                    "_id": "string",
                    "_date": "date",
                    "sn": "string",
                    "description": "string",
                    "license": "array"
                },
                "access": "superdmin aggregators.admin"
            },
            "remove": {
                "params": {
                    "_id": "string"
                },
                "access": "superdmin aggregators.admin"
            },
            "licenseadd": {
                "params": {
                    "_id": "string",
                    "_date": "date",
                    "ports": "number",
                    "mpls": "boolean",
                    "mirror": "boolean",
                    "filename": "string"
                },
                "access": "superdmin aggregators.admin"
            },
            "licenseremove": {
                "params": {
                    "index": "string"
                },
                "access": "superdmin aggregators.admin"
            }
        }
    }
};
