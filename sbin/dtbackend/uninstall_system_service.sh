#!/bin/bash

SERVICE=mdt-gui-backend

sudo systemctl stop $SERVICE
sudo systemctl disable $SERVICE
sudo rm /etc/systemd/system/$SERVICE.service
sudo systemctl daemon-reload
sudo systemctl reset-failed