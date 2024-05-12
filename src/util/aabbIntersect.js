const AABBIntersect = (ax, ay, aw, ah, bx, by, bw, bh) => {
	return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
};

export default AABBIntersect;
