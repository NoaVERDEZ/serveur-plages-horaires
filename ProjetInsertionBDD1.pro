QT += core gui sql

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = ProjetInsertionBDD
TEMPLATE = app

SOURCES += \
    main.cpp \
    mainwindow.cpp \
    BDD.cpp

HEADERS += \
    mainwindow.h \
    BDD.h

FORMS += \
    mainwindow.ui
