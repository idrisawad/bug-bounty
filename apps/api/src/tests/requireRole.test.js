import test from "node:test";
import assert from "node:assert/strict";
import { requireRole } from "../middleware/requireRole.js";
import express from "express";

function mockRes() {
  const res = { statusCode: 0, body: null };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  return res;
}

test("requireRole – allows access when user has the required role", () => {
  const middleware = requireRole("admin");
  const req = { user: { role: "admin" } };
  let called = false;
  middleware(req, mockRes(), () => { called = true; });
  assert.equal(called, true);
});

test("requireRole – blocks access when user has a different role", () => {
  const middleware = requireRole("admin");
  const req = { user: { role: "freelancer" } };
  const res = mockRes();
  let called = false;
  middleware(req, res, () => { called = true; });
  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /insufficient permissions/i);
});

test("requireRole – blocks access when user has no role", () => {
  const middleware = requireRole("admin");
  const req = { user: {} };
  const res = mockRes();
  let called = false;
  middleware(req, res, () => { called = true; });
  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /no role assigned/i);
});

test("requireRole – blocks access when req.user is missing", () => {
  const middleware = requireRole("admin");
  const req = {};
  const res = mockRes();
  let called = false;
  middleware(req, res, () => { called = true; });
  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
});

test("requireRole – accepts multiple roles", () => {
  const middleware = requireRole("admin", "superadmin");
  const req = { user: { role: "superadmin" } };
  let called = false;
  middleware(req, mockRes(), () => { called = true; });
  assert.equal(called, true);
});
