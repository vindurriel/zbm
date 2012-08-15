#encoding=utf-8
import time
def create_dish(c):
	c.execute("drop table if exists dish")
	c.execute('''
	create table dish(name text,price real,unit text, type unit)
	''')
def create_user(c):
	c.execute("drop table if exists user")
	c.execute('''
	create table user(username text,password text)
	''')
def create_order(c):
	c.execute("drop table if exists orders")
	c.execute('''
	create table orders(userid integer,dishid integer,qty integer, time text)
	''')
def populate_user(c):
	f=open("人名.txt")
	for line in f.readlines():
		name=line.split()[0]
		c.execute('''
		insert into user values ('%s','')
		'''%name)
def populate_dish(c):
	t=""
	f=open(u"菜单.txt")
	for line in f.readlines():
		if (line[0]=="-"): 
			t=line[1:]
			continue
		fields=line.split()
		name,price,unit=fields[0],fields[1],None
		if len(fields)==3: unit=fields[2]	
		c.execute('''
		insert into dish values ('%s',%f,'%s','%s')
		'''%(name,float(price),unit,t))
def add_order(c,userid,dishid,qty):
	t=time.strftime("%Y%m%d",time.localtime())
	ampm=0
	if time.localtime().tm_hour>15: ampm=1
	t+=ampm
	c.execute('''
	insert into orders values(%d,%d,%d,'%s')
	'''%(userid,dishid,qty,t))
def look(c):
	c.execute('''
	select * from orders
	''')
	result= c.fetchall()
	for x in result:
		print x[0]

import sqlite3
con=sqlite3.connect("menu.db")
c=con.cursor()
#populate_user(c)
#create_order(c)
populate_dish(c)
#add_order(c,2,12,1)
con.commit()
#create_dish(c)
#populate(c)	
