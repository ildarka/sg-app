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
            "template": "modules/software/software.html",
            "title": "Генератор трафика",
            "controller": "softwareCtrl",
            "access": "user"
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
                "login": {
                    "params": {
                        "name": "string",
                        "password": "string"
                    },
                    "response": {
                        "token": "string",
                        "user": {
                            "id": "string",
                            "date": "date",
                            "name": "string",
                            "password": "string",
                            "state": "boolean",
                            "role": "string"
                        }
                    }
                },
                "logout": {
                    "params": {
                        "token": "string"
                    }
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
                "read": "superadmin aggregators.admin aggregators.user",
                "write": "superadmin aggregators.admin"
            },
            "model": {
                "id": "string",
                "date": "date",
                "sn": "string",
                "description": "string",
                "license": "array"
            },
            "license": {
                "id": "string",
                "ports": "number",
                "mpls": "boolean",
                "mirror": "boolean"
            },
            "methods": {
                "get": {
                    "access": "superadmin aggregators.admin aggregators.user"
                },
                "add": {
                    "params": {
                        "id": "string",
                        "date": "date",
                        "sn": "string",
                        "description": "string",
                        "license": "array"
                    },
                    "access": "superadmin aggregators.admin"
                },
                "update": {
                    "params": {
                        "id": "string",
                        "date": "date",
                        "sn": "string",
                        "description": "string",
                        "license": "array"
                    },
                    "access": "superadmin aggregators.admin"
                },
                "remove": {
                    "params": {
                        "id": "string"
                    },
                    "access": "superadmin aggregators.admin"
                },
                "licenseadd": {
                    "params": {
                        "id": "string",
                        "ports": "number",
                        "mpls": "boolean",
                        "mirror": "boolean"
                    },
                    "access": "superadmin aggregators.admin"
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
        }
    },
    "wsport": 3001,
    "port": 3000,
    "baseUri": "ws://localhost",
    "description": null,
    "title": "Aggregator GUI"
};
