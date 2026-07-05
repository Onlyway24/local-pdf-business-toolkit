# LOCAL PDF BUSINESS TOOLKIT - PROJECT CONTINUITY

## Purpose

This document preserves continuity for the Local PDF Business Toolkit project.

If chat history is lost, this file explains what the project is, why it exists, and what direction it must follow.

---

## Project Identity

Project name:

Local PDF Business Toolkit

Location:

Only-Way-Laboratory/projects/003-local-pdf-business-toolkit

Role:

A local terminal-first toolkit for organizing documents, scanning folders, generating reports, and preparing client-ready file packs.

---

## Strategic Goal

The goal is to use the MacBook locally to create practical tools that can generate business value without paid API tokens.

This project should become a practical utility that can be:

- used personally
- shown as a demo
- sold as a service
- expanded into a micro-product
- used as portfolio proof

---

## What This Project Is Not

This project is not:

- an AI operating system
- an agent framework
- a Core Brain
- a clone of MV-AI-OS
- a generic orchestration platform
- a paid API product

MV-AI-OS already covers architecture-heavy AI infrastructure.

This project focuses on practical local document tools.

---

## First Version Goal

The first version should:

1. scan an input folder
2. detect files
3. collect basic file information
4. generate a clean report
5. save the report inside outputs/
6. run fully from terminal

---

## Future Features

Possible future features:

- clean filenames
- rename documents safely
- group files by type
- create client folders
- generate document checklists
- detect missing documents
- prepare business document packs
- export reports as Markdown or TXT
- later support PDF text extraction
- later support local AI summarization if available

---

## Development Rules

Every feature must be:

- local-first
- simple
- useful
- documented
- testable
- safe for files
- not dependent on MV-AI-OS
- not dependent on paid APIs

Generated outputs must go inside outputs/.

Input documents should go inside input/ or samples/.

The project must never modify original files unless the command explicitly says it will.

---

## Current Status

Initial project created.

Next task:

Build the first folder scan command.
