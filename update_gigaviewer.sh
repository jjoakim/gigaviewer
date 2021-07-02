#!/bin/bash
LOCKFILE=/tmp/lock.txt
if [ -e ${LOCKFILE} ] && kill -0 `cat ${LOCKFILE}`; then
    echo "already running"
    exit
fi

trap "rm -f ${LOCKFILE}; exit" INT TERM EXIT
echo $$ > ${LOCKFILE}

python /home/rapiduser/dz_create.py
python /home/rapiduser/update_viewer.py

rm -f ${LOCKFILE}
