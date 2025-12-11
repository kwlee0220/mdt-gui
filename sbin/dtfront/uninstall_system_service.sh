#!/bin/bash

SERVICE=mdt-gui-front

sudo systemctl stop $SERVICE
sudo systemctl disable $SERVICE
sudo rm /etc/systemd/system/$SERVICE.service
sudo systemctl daemon-reload
sudo systemctl reset-failed