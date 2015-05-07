# volume container
docker create -v /tmp:/tmp -v /var/lib/qb:/var/lib/qb --name qb_volume laisky/qb /bin/true

# run qb
docker run -i -t -d --volumes-from qb_volume -p 8000:8000 --add-host "dbhost:173.230.154.73" -e "DBHOST=173.230.154.73" --name qb laisky/qb

# run qb_log
# docker run -i -t --volumes-from qb_volume --name qb_log laisky/qb /bin/bash
