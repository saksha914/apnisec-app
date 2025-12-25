import { NextRequest, NextResponse } from 'next/server';

// Mock issues data
const mockIssues = [
  {
    id: 'issue-1',
    title: 'SQL Injection Vulnerability',
    description: 'Detected SQL injection vulnerability in login form',
    type: 'VAPT',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'issue-2', 
    title: 'Misconfigured S3 Bucket',
    description: 'S3 bucket has public read access enabled',
    type: 'CLOUD_SECURITY',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      issues: mockIssues
    });
  } catch (error) {
    console.error('Issues fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }
    
    const newIssue = {
      id: 'issue-' + Date.now(),
      title: body.title,
      description: body.description,
      type: body.type || 'VAPT',
      status: 'OPEN',
      priority: body.priority || 'MEDIUM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockIssues.unshift(newIssue);
    
    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error('Issue creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 }
    );
  }
}